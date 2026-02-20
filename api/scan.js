import 'dotenv/config'; // Load .env for local development

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequests = new Map();

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequests.entries()) {
        if (now - data.startTime > RATE_LIMIT_WINDOW) {
            ipRequests.delete(ip);
        }
    }
}, RATE_LIMIT_WINDOW);

export default async function handler(req, res) {
    // CORS for local development
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Rate Limiting Logic
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequests.has(clientIp)) {
        ipRequests.set(clientIp, { count: 1, startTime: now });
    } else {
        const data = ipRequests.get(clientIp);
        if (now - data.startTime > RATE_LIMIT_WINDOW) {
            // Reset window
            ipRequests.set(clientIp, { count: 1, startTime: now });
        } else {
            // Increment count
            data.count++;
            if (data.count > MAX_REQUESTS_PER_WINDOW) {
                return res.status(429).json({
                    error: 'Too many requests. Please try again later.',
                    retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - data.startTime)) / 1000)
                });
            }
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // 1. Google Safe Browsing Check
        const googleResult = await checkGoogleSafeBrowsing(url);

        // 2. WHOIS / Domain Age Check (Abstract API or WhoisXML)
        // Note: You need to get a free API key from https://www.abstractapi.com/api/website-reputation-api
        // or https://whois.whoisxmlapi.com/
        const whoisResult = await checkWhois(url);

        // 3. Combine Results
        const riskScore = calculateRiskScore(googleResult, whoisResult);

        return res.status(200).json({
            url,
            riskScore,
            riskLevel: getRiskLevel(riskScore),
            checks: [
                {
                    id: 'google-safe-browsing',
                    name: 'Google Safe Browsing',
                    status: googleResult.safe ? 'safe' : 'danger',
                    message: googleResult.safe
                        ? 'URL is not listed in Google\'s database of unsafe sites.'
                        : 'DANGER: Google identifies this site as unsafe!'
                },
                {
                    id: 'domain-age',
                    name: 'Domain Age & Reputation',
                    status: whoisResult.age > 180 ? 'safe' : (whoisResult.age < 30 ? 'danger' : 'warning'),
                    message: `Domain was created ${whoisResult.ageDays} days ago. ${whoisResult.age < 30 ? 'Fresh domains are often used for phishing.' : 'Established domain.'}`
                }
                // Add more server-side checks here
            ],
            domainInfo: whoisResult.details
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({ error: 'Failed to analyze URL' });
    }
}

async function checkGoogleSafeBrowsing(url) {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
    if (!apiKey) return { safe: true, warning: 'No API Key' }; // Fail open if no key

    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const requestBody = {
        client: {
            clientId: "phishing-analyzer-demo",
            clientVersion: "1.0.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        // If "matches" is empty/undefined, it's safe
        return { safe: !data.matches };
    } catch (e) {
        console.error('GSB Error:', e);
        return { safe: true, error: true };
    }
}

async function checkWhois(url) {
    const apiKey = process.env.ABSTRACT_API_KEY;

    // Extract domain for consistent fallback/usage
    let domain;
    try {
        domain = new URL(url.startsWith('http') ? url : `http://${url}`).hostname;
    } catch (e) {
        domain = url;
    }

    if (!apiKey) {
        console.warn('No ABSTRACT_API_KEY found, using mock data.');
        return getMockWhois(domain);
    }

    const apiUrl = `https://website-reputation.abstractapi.com/v1/?api_key=${apiKey}&url=${url}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Abstract API Error: ${response.status}`);

        const data = await response.json();

        // Abstract API returns creation_date in Unix timestamp (seconds) or null
        // Sometimes it returns legitimate status directly

        let creationDate = data.creation_date ? new Date(data.creation_date * 1000) : null;
        let ageDays = 0;

        if (creationDate) {
            const now = new Date();
            const diffTime = Math.abs(now - creationDate);
            ageDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } else {
            // If date is missing but legitimacy is high, assume old
            if (data.legitimacy_score > 70) ageDays = 1000;
        }

        return {
            age: ageDays,
            ageDays: ageDays,
            details: {
                domain: data.domain || domain,
                registrar: data.registrar || 'Unknown',
                creationDate: creationDate ? creationDate.toISOString().split('T')[0] : 'Unknown',
                country: data.owner_country || 'Unknown',
                legitimacyScore: data.legitimacy_score // 0-100
            }
        };

    } catch (error) {
        console.error('WHOIS Check Error:', error);
        return getMockWhois(domain);
    }
}

function getMockWhois(domain) {
    return {
        age: 1000,
        ageDays: 1000,
        details: {
            domain: domain,
            registrar: 'GoDaddy.com, LLC (Mock)',
            creationDate: '2020-01-01',
            country: 'US'
        }
    };
}

function calculateRiskScore(google, whois) {
    let score = 10; // Base score (safe)

    if (!google.safe) score += 90; // High danger
    if (whois.age < 30) score += 40; // New domain risk
    if (whois.age < 180) score += 20; // Assessment phase

    return Math.min(score, 100);
}

function getRiskLevel(score) {
    if (score >= 70) return 'High Risk';
    if (score >= 30) return 'Suspicious';
    return 'Safe';
}
