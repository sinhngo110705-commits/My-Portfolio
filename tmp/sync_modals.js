const fs = require('fs');
const path = require('path');

const rootHtmlPath = 'Sinh Portfolio web/index.html';
const rootHtml = fs.readFileSync(rootHtmlPath, 'utf8');

// Extract the login button
const loginBtnMatch = rootHtml.match(/<li><button\s+id="nav-login-btn"[^>]+>.*?<\/button><\/li>/);
const loginBtnMarkup = loginBtnMatch ? loginBtnMatch[0] : '';
if (!loginBtnMarkup) throw new Error("Could not find nav-login-btn in root index.html");

// Extract the modals: chatbot to topup-modal-overlay
// We'll regex it safely by extracting from id="chatbot-container" to <!-- Use CDN GSAP
const startStr = '<!-- Chatbot AI Local -->';
if (!rootHtml.includes(startStr)) throw new Error("Could not find chatbot start");
let indexStart = rootHtml.indexOf(startStr);

const endStr = '<!-- Use CDN GSAP'; // or before script tags
let indexEnd = rootHtml.indexOf(endStr);
if (indexEnd === -1) {
    indexEnd = rootHtml.lastIndexOf('<script ');
}

if (indexEnd <= indexStart) throw new Error("Could not find end of modals");
const modalsMarkup = rootHtml.substring(indexStart, indexEnd);

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (filePath === path.normalize(rootHtmlPath)) continue; // skip root
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (filePath.endsWith('index.html') || filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const targetDirs = [
    'Sinh Portfolio web/portfolio',
    'Sinh Portfolio web/services',
];

const allHtmlFiles = [];
targetDirs.forEach(d => {
    if (fs.existsSync(d)) {
        findHtmlFiles(d, allHtmlFiles);
    }
});

for (const filePath of allHtmlFiles) {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove existing login btn
    content = content.replace(/<li>\s*<button\s+id="nav-login-btn"[\s\S]*?<\/button>\s*<\/li>/g, '');
    
    // Inject login btn, at end of <ul class="nav-links">
    content = content.replace(/(<\/ul>\s*<\/nav>)/, `    ${loginBtnMarkup}\n            $1`);

    // Remove old modals
    // We will clean anything from <!-- Chatbot AI Local --> to the end of <div id="chatbot-container"> ...
    // Wait, the easiest way is to remove existing known blocks.
    const blocksToRemove = [
        /<div\s+id="chatbot-container"[\s\S]*?(?=<(?:footer|script|div\s+id="auth-modal-overlay"|!--))/g,
        /<!-- Chatbot AI Local -->[\s\S]*?(?=<footer|<script|<!-- Fixed UI)/g,
        /<div\s+id="auth-modal-overlay"[\s\S]*?(?=<footer|<script|<\/body)/g,
        /<!-- Auth Modal Overlay -->[\s\S]*?(?=<footer|<script|<\/body)/g,
        /<div\s+id="topup-modal-overlay"[\s\S]*?(?=<footer|<script|<\/body)/g,
        /<!-- User Dashboard Modal Overlay -->[\s\S]*?(?=<footer|<script|<\/body)/g,
    ];

    blocksToRemove.forEach(regex => {
        let prev;
        do {
            prev = content;
            content = content.replace(regex, '');
        } while (content !== prev);
    });

    // Inject modalsMarkup right before the scripts or </body>
    const insertPoint = content.lastIndexOf('<script ');
    if (insertPoint !== -1) {
        content = content.substring(0, insertPoint) + '\n' + modalsMarkup + '\n    ' + content.substring(insertPoint);
    } else {
        content = content.replace('</body>', `\n${modalsMarkup}\n</body>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done syncing HTML components.');
