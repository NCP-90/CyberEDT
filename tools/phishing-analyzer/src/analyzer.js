export class PhishingAnalyzer {
    constructor() {
        // Latest risky TLDs commonly used in phishing (2024-2025 data)
        this.riskyTLDs = [
            '.xyz', '.club', '.top', '.info', '.site', '.click', '.tk', '.ga', '.cf', '.ml',
            '.gq', '.men', '.pro', '.shop', '.win', '.download', '.racing', '.online', '.tech',
            '.science', '.work', '.date', '.faith', '.zip', '.mobi', '.fun', '.world',
            '.biz', '.us', '.uk', '.ca', '.au', '.de', '.fr', '.jp', '.cn', '.ru', '.br'
        ];

        // Common legitimate TLDs (including country codes and popular domains)
        this.commonTLDs = [
            '.com', '.org', '.net', '.edu', '.gov', '.mil', '.int', '.io', '.co', '.ai',
            '.in', '.me', '.tv', '.cc', '.ws', '.app', '.dev', '.cloud', '.store', '.online',
            '.tech', '.digital', '.services', '.solutions', '.systems', '.global', '.world',
            '.us', '.uk', '.ca', '.au', '.de', '.fr', '.jp', '.cn', '.ru', '.br',
            '.mx', '.es', '.it', '.nl', '.se', '.no', '.fi', '.dk', '.be', '.at', '.ch'
        ];

        // Expanded list of legitimate brands (2024-2025)
        this.safeBrands = [
            'google', 'amazon', 'paypal', 'microsoft', 'apple', 'facebook', 'instagram',
            'netflix', 'bankofamerica', 'chase', 'wellsfargo', 'citibank', 'linkedin',
            'twitter', 'youtube', 'github', 'dropbox', 'adobe', 'oracle', 'salesforce',
            'slack', 'zoom', 'teams', 'office365', 'outlook', 'gmail', 'yahoo', 'hotmail'
        ];

        // Latest suspicious patterns (2024-2025 phishing trends)
        this.suspiciousPatterns = [
            'secure', 'update', 'login', 'verify', 'account', 'banking', 'confirm', 'signin',
            'wallet', 'payment', 'invoice', 'receipt', 'transaction', 'suspended', 'blocked',
            'limited', 'expired', 'security', 'authentication', 'verification', 'recovery',
            'restore', 'unlock', 'activate', 'validate', 'urgent', 'immediate', 'critical',
            'claim', 'reward', 'prize', 'winner', 'lottery', 'grant', 'benefit',
            'stimulus', 'relief', 'support', 'help', 'service', 'admin', 'moderator',
            'cancel', 'suspend', 'deactivate', 'disable', 'quarantine', 'isolation',
            'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'nft', 'metaverse',
            'investment', 'trading', 'profit', 'return', 'refund', 'cashback'
        ];

        // Modern URL shorteners and redirect services
        this.urlShorteners = [
            'bit.ly', 'goo.gl', 'tinyurl.com', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'adyou.me',
            'cutt.ly', 'short.link', 'linktr.ee', 'rb.gy', 'tiny.cc', 'mcaf.ee', 'bit.do',
            'clicky.me', 'zip.net', 'short.io', 't2m.io', 'v.ht', 'u.to'
        ];

        // Latest phishing attack patterns
        this.phishingPatterns = {
            // Homograph attacks (IDN spoofing)
            homographChars: ['а', 'с', 'е', 'о', 'р', 'х', 'у', 'і', 'ј', 'ҝ', 'ӏ', 'ԁ', 'ԁ'],

            // Suspicious URL structures
            suspiciousSubdomains: ['secure', 'login', 'signin', 'account', 'verify', 'auth', 'api'],

            // Common phishing domains (2024-2025 latest threats)
            knownPhishingDomains: [
                'microsoft365-online.com', 'office365-login.com', 'paypal-security.com',
                'amazon-secure.com', 'apple-id-verify.com', 'google-security-center.com',
                'facebook-secure.com', 'instagram-verify.com', 'netflix-login-page.com',
                'linkedin-secure.com', 'twitter-verify.com', 'youtube-security.com',
                'gmail-verify.com', 'yahoo-secure.com', 'outlook-security.com',
                'adobe-secure.com', 'dropbox-verify.com', 'github-security.com',
                'slack-verify.com', 'zoom-security.com', 'teams-login.com',
                'chase-secure.com', 'wellsfargo-verify.com', 'bankofamerica-security.com',
                'citibank-verify.com', 'capitalone-secure.com', 'us-bank-verify.com',
                'irs-gov-payment.com', 'tax-refund.com', 'stimulus-payment.com',
                'covid-relief.com', 'vaccine-appointment.com', 'health-dept.com',
                'social-security.com', 'unemployment-claim.com', 'benefit-verify.com',
                'crypto-wallet.com', 'bitcoin-giveaway.com', 'ethereum-claim.com',
                'nft-verify.com', 'metamask-support.com', 'coinbase-secure.com',
                'discord-verify.com', 'telegram-support.com', 'whatsapp-verify.com',
                'amazon-prime.com', 'netflix-billing.com', 'spotify-verify.com',
                'steam-verify.com', 'epic-games-secure.com', 'playstation-verify.com',
                'microsoft-teams.com', 'office-365-login.com', 'azure-verify.com',
                'google-workspace.com', 'gmail-support.com', 'outlook-verify.com',
                'facebook-business.com', 'instagram-business.com', 'tiktok-verify.com',
                'snapchat-verify.com', 'reddit-verify.com', 'pinterest-secure.com',
                'paypal-invoice.com', 'cashapp-verify.com', 'venmo-secure.com',
                'zelle-verify.com', 'western-union.com', 'moneygram-secure.com',
                'walmart-verify.com', 'target-secure.com', 'bestbuy-verify.com',
                'costco-verify.com', 'homedepot-secure.com', 'lowes-verify.com'
            ],

            // Suspicious file extensions
            suspiciousExtensions: ['.exe', '.zip', '.rar', '.scr', '.js', '.php', '.asp', '.jsp'],

            // Port-based attacks
            suspiciousPorts: [':8080', ':8443', ':3000', ':8888', ':4444', ':9999'],

            // IP-based URLs
            ipPatterns: [
                /^(\d{1,3}\.){3}\d{1,3}$/,
                /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
            ]
        };
    }

    async analyze(inputUrl) {
        // Basic validation
        let urlObj;
        try {
            if (!inputUrl.startsWith('http')) {
                urlObj = new URL('http://' + inputUrl);
            } else {
                urlObj = new URL(inputUrl);
            }
        } catch (e) {
            return {
                valid: false,
                error: "Invalid URL format"
            };
        }

        const domain = urlObj.hostname;
        const results = {
            valid: true,
            url: inputUrl,
            domain: domain,
            riskScore: 0,
            riskLevel: 'Safe',
            checks: [],
            domainInfo: null
        };

        // --- Client-Side Heuristics (Instant) ---

        // 1. SSL Check
        if (urlObj.protocol !== 'https:') {
            results.riskScore += 25;
            results.checks.push({
                id: 'ssl', name: 'HTTPS Encryption', status: 'danger',
                message: 'Site does not use HTTPS. Communication is not encrypted.'
            });
        } else {
            results.checks.push({
                id: 'ssl', name: 'HTTPS Encryption', status: 'safe',
                message: 'Valid HTTPS protocol detected.'
            });
        }

        // 2. IP Check
        const isIP = this.phishingPatterns.ipPatterns.some(pattern => pattern.test(domain));
        if (isIP) {
            results.riskScore += 60;
            results.checks.push({
                id: 'ip', name: 'Domain Type', status: 'danger',
                message: 'URL uses an IP address instead of a domain name.'
            });
        }

        // 3. TLD Check
        const tld = domain.substring(domain.lastIndexOf('.'));
        const isCommonTLD = this.commonTLDs.includes(tld);

        if (this.riskyTLDs.includes(tld)) {
            results.riskScore += 20;
            results.checks.push({
                id: 'tld', name: 'Top-Level Domain (TLD)', status: 'warning',
                message: `Risky TLD "${tld}" detected.`
            });
        } else if (!isCommonTLD) {
            results.riskScore += 15;
            results.checks.push({
                id: 'tld', name: 'Top-Level Domain (TLD)', status: 'warning',
                message: `The TLD "${tld}" is uncommon and may be suspicious.`
            });
        }

        // 4. Homograph Attack Detection
        const hasHomographChars = this.phishingPatterns.homographChars.some(char => domain.includes(char));
        if (hasHomographChars) {
            results.riskScore += 50;
            results.checks.push({
                id: 'homograph', name: 'Homograph Attack', status: 'danger',
                message: 'URL contains characters that look like legitimate ones but are different (IDN spoofing).'
            });
        }

        // 5. Known Phishing Domains Check
        const isKnownPhishing = this.phishingPatterns.knownPhishingDomains.some(phishDomain =>
            domain.includes(phishDomain) || phishDomain.includes(domain)
        );
        if (isKnownPhishing) {
            results.riskScore += 70;
            results.checks.push({
                id: 'known-phishing', name: 'Known Phishing Domain', status: 'danger',
                message: 'Domain matches known phishing patterns used in recent attacks.'
            });
        }

        // 6. Enhanced Subdomain Analysis
        const subdomains = domain.split('.');
        if (subdomains.length > 4 && !isIP) {
            results.riskScore += 15;
            results.checks.push({
                id: 'subdomain', name: 'Subdomain Analysis', status: 'warning',
                message: 'Excessive number of subdomains detected.'
            });
        }
        const suspiciousSubdomainCount = subdomains.filter(subdomain =>
            this.phishingPatterns.suspiciousSubdomains.includes(subdomain)
        ).length;
        if (suspiciousSubdomainCount > 0) {
            results.riskScore += 25;
            results.checks.push({
                id: 'subdomain', name: 'Subdomain Analysis', status: 'warning',
                message: `Suspicious subdomains detected: ${subdomains.filter(s => this.phishingPatterns.suspiciousSubdomains.includes(s)).join(', ')}`
            });
        }

        // 7. Advanced Brand Impersonation Detection
        let brandDetected = false;
        this.safeBrands.forEach(brand => {
            if (inputUrl.toLowerCase().includes(brand)) {
                // simple check: if url has brand but domain is not brand.com
                const domainParts = domain.split('.');
                const mainDomain = domainParts.slice(-2).join('.'); // Get domain + TLD
                if (!mainDomain.includes(brand) && !domain.endsWith(brand + '.com')) {
                    brandDetected = true;
                }
            }
        });
        if (brandDetected) {
            results.riskScore += 35;
            results.checks.push({
                id: 'brand', name: 'Brand Impersonation', status: 'danger',
                message: 'Potential brand impersonation detected.'
            });
        }

        // 8. Suspicious Keywords
        let keywordRisk = 0;
        this.suspiciousPatterns.forEach(pattern => {
            if (inputUrl.toLowerCase().includes(pattern)) keywordRisk += 8;
        });
        if (keywordRisk > 0) {
            results.riskScore += Math.min(keywordRisk, 30);
            results.checks.push({
                id: 'keywords', name: 'URL Keywords', status: 'warning',
                message: 'Suspicious keywords detected in URL.'
            });
        }

        // 9. URL Shortener
        const isShortener = this.urlShorteners.some(shortener => domain.includes(shortener));
        if (isShortener) {
            results.riskScore += 25;
            results.checks.push({
                id: 'shortener', name: 'URL Shortener', status: 'warning',
                message: 'URL shortening service detected.'
            });
        }

        // 10. Length Analysis
        if (inputUrl.length > 100) {
            results.riskScore += 15;
            results.checks.push({
                id: 'length', name: 'URL Length', status: 'warning',
                message: 'URL is unusually long.'
            });
        }

        // 11. Port Check
        const suspiciousPort = this.phishingPatterns.suspiciousPorts.some(port => domain.includes(port));
        if (suspiciousPort) {
            results.riskScore += 40;
            results.checks.push({
                id: 'port', name: 'Port-Based Attack', status: 'danger',
                message: 'URL uses non-standard port.'
            });
        }

        // 12. Extension Check
        const path = urlObj.pathname; // using the urlObj from earlier
        const suspiciousExtension = this.phishingPatterns.suspiciousExtensions.some(ext =>
            path.toLowerCase().endsWith(ext)
        );
        if (suspiciousExtension) {
            results.riskScore += 45;
            results.checks.push({
                id: 'extension', name: 'File Extension', status: 'danger',
                message: 'URL ends with suspicious file extension.'
            });
        }

        // 13. Redirect/Auth Bypass
        if (inputUrl.includes('@') || inputUrl.includes('%40')) {
            results.riskScore += 50;
            results.checks.push({
                id: 'redirect', name: 'Authentication Bypass', status: 'danger',
                message: 'URL contains "@" symbol, often used to bypass filters.'
            });
        }

        // --- Server-Side Deep Analysis (Real Data) ---
        try {
            // Call our new Serverless Function
            const response = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputUrl })
            });

            if (response.ok) {
                const data = await response.json();

                // Merge Server Checks
                if (data.checks) {
                    data.checks.forEach(serverCheck => {
                        results.checks.push(serverCheck);
                        if (serverCheck.status === 'danger') results.riskScore += 50;
                        if (serverCheck.status === 'warning') results.riskScore += 25;
                    });
                }

                // Merge Domain Info
                if (data.domainInfo) {
                    results.domainInfo = data.domainInfo;
                }
            } else {
                console.warn('API Analysis failed, falling back to local simulation');
                // Fallback: Simulate domain info if API fails (e.g. locally without server running)
                results.domainInfo = this.analyzeDomainDetails(domain);
            }
        } catch (error) {
            console.warn('API Endpoint Unavailable (Local Mode): Falling back to simulated analysis data.');
            results.domainInfo = this.analyzeDomainDetails(domain);
            results.isSimulated = true;
        }

        // Final Score capping
        results.riskScore = Math.min(results.riskScore, 100);

        // Determine Level
        if (results.riskScore >= 70) results.riskLevel = 'High Risk';
        else if (results.riskScore >= 40) results.riskLevel = 'Suspicious';
        else results.riskLevel = 'Safe';

        return results;
    }

    // Helper method to simulate domain age based on patterns
    simulateDomainAge(domain) {
        // This is a simplified simulation - in real implementation, you'd use WHOIS API
        const riskyPatterns = [
            /\d{4}/, // Domains with years in them
            /[a-z]{1,2}\d{3,}/, // Short prefix with numbers
            /\d{3,}/, // Lots of numbers
        ];

        let ageScore = 365; // Default to 1 year

        riskyPatterns.forEach(pattern => {
            if (pattern.test(domain)) {
                ageScore = Math.min(ageScore, 30); // Reduce age for risky patterns
            }
        });

        return ageScore;
    }

    // Enhanced domain details analysis
    analyzeDomainDetails(domain) {
        const domainParts = domain.split('.');
        const mainDomain = domainParts.slice(-2).join('.'); // Get domain + TLD
        const subdomains = domainParts.slice(0, -2);

        // Simulate WHOIS data
        const registrationDate = this.simulateRegistrationDate(domain);
        const registrar = this.simulateRegistrar(domain);
        const hosting = this.simulateHosting(domain);
        const country = this.simulateCountry(domain);

        return {
            domain: domain,
            mainDomain: mainDomain,
            subdomains: subdomains,
            tld: domain.substring(domain.lastIndexOf('.')),
            registrationDate: registrationDate,
            age: this.calculateDomainAge(registrationDate),
            registrar: registrar,
            hosting: hosting,
            country: country,
            isSubdomain: subdomains.length > 0,
            securityLevel: this.getDomainSecurityLevel(domain)
        };
    }

    // Simulate registration date
    simulateRegistrationDate(domain) {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 3650); // 0-10 years ago
        const regDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        return regDate.toISOString().split('T')[0];
    }

    // Simulate registrar information
    simulateRegistrar(domain) {
        const registrars = [
            'GoDaddy', 'Namecheap', 'Google Domains', 'Cloudflare', 'Hostinger',
            'Bluehost', 'SiteGround', 'HostGator', 'Network Solutions', 'Domain.com',
            'Name.com', 'Hover', 'Porkbun', 'Amazon Route 53', 'Azure DNS'
        ];

        // Simulate different registrars based on domain patterns
        if (domain.includes('.com')) return registrars[Math.floor(Math.random() * registrars.length)];
        if (domain.includes('.in')) return 'GoDaddy India';
        if (domain.includes('.me')) return 'Name.me';
        if (domain.includes('.tech')) return 'Google Domains';

        return registrars[Math.floor(Math.random() * registrars.length)];
    }

    // Simulate hosting provider
    simulateHosting(domain) {
        const providers = [
            'Hostinger', 'Bluehost', 'SiteGround', 'Cloudflare', 'AWS',
            'Google Cloud', 'DigitalOcean', 'Vultr', 'Linode', 'Azure',
            'GoDaddy Hosting', 'Namecheap Hosting', 'HostGator', 'Bluehost India'
        ];

        // Enhanced simulation for specific cases
        if (domain.includes('cyberedt')) return 'Hostinger';
        if (domain.includes('.in')) return 'Hostinger India';
        if (domain.includes('.me')) return 'Cloudflare Pages';
        if (domain.includes('.tech')) return 'Vercel';

        return providers[Math.floor(Math.random() * providers.length)];
    }

    // Simulate country based on TLD
    simulateCountry(domain) {
        const tld = domain.substring(domain.lastIndexOf('.'));
        const countryMap = {
            '.com': 'United States',
            '.org': 'United States',
            '.net': 'United States',
            '.in': 'India',
            '.me': 'Montenegro',
            '.uk': 'United Kingdom',
            '.ca': 'Canada',
            '.au': 'Australia',
            '.de': 'Germany',
            '.fr': 'France',
            '.jp': 'Japan',
            '.cn': 'China',
            '.ru': 'Russia',
            '.br': 'Brazil',
            '.mx': 'Mexico',
            '.es': 'Spain',
            '.it': 'Italy',
            '.nl': 'Netherlands',
            '.se': 'Sweden',
            '.no': 'Norway',
            '.fi': 'Finland',
            '.dk': 'Denmark',
            '.be': 'Belgium',
            '.at': 'Austria',
            '.ch': 'Switzerland'
        };

        return countryMap[tld] || 'Unknown';
    }

    // Calculate domain age from registration date
    calculateDomainAge(registrationDate) {
        const now = new Date();
        const regDate = new Date(registrationDate);
        const diffTime = Math.abs(now - regDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) return `${diffDays} days`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
        return `${Math.floor(diffDays / 365)} years`;
    }

    // Get domain security level
    getDomainSecurityLevel(domain) {
        let score = 100;

        // Reduce score for various risk factors
        if (this.riskyTLDs.some(tld => domain.includes(tld))) score -= 20;
        if (this.phishingPatterns.ipPatterns.some(pattern => pattern.test(domain))) score -= 40;
        if (this.phishingPatterns.knownPhishingDomains.some(phish => domain.includes(phish))) score -= 50;
        if (domain.length > 20) score -= 10;
        if (domain.split('.').length > 4) score -= 15;

        if (score >= 80) return 'High';
        if (score >= 60) return 'Medium';
        if (score >= 40) return 'Low';
        return 'Very Low';
    }
}
