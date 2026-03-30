const fs = require('fs');
const path = require('path');

const rootHtmlPath = 'Sinh Portfolio web/index.html';
const rootHtml = fs.readFileSync(rootHtmlPath, 'utf8');

// Extract the login button
const loginBtnMatch = rootHtml.match(/<li><button\s+id="nav-login-btn"[^>]+>.*?<\/button><\/li>/);
const loginBtnMarkup = loginBtnMatch ? loginBtnMatch[0] : '';
if (!loginBtnMarkup) throw new Error("Could not find nav-login-btn in root index.html");

// Extract the Theme Initialization Script
const themeScriptMatch = rootHtml.match(/<!-- Theme Initialization Script \(Prevent FOUC\) -->[\s\S]*?<\/script>/);
const themeScriptMarkup = themeScriptMatch ? themeScriptMatch[0] : '';
if (!themeScriptMarkup) console.warn("Could not find Theme Initialization Script in root index.html");

// Extract the modals: From ui-controls to topup-modal-overlay
const startStr = '<!-- Fixed UI Controls -->';
if (!rootHtml.includes(startStr)) throw new Error("Could not find ui-controls start");
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

    // Remove old modals & controls
    const blocksToRemove = [
        /<!-- Fixed UI Controls -->[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+class="ui-controls"[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+id="chatbot-container"[\s\S]*?(?=<script|<\/body)/g,
        /<!-- Chatbot AI Local -->[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+id="auth-modal-overlay"[\s\S]*?(?=<script|<\/body)/g,
        /<!-- Auth Modal Overlay -->[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+id="topup-modal-overlay"[\s\S]*?(?=<script|<\/body)/g,
        /<!-- User Dashboard Modal Overlay -->[\s\S]*?(?=<script|<\/body)/g,
    ];

    blocksToRemove.forEach(regex => {
        content = content.replace(regex, '');
    });

    // Inject modalsMarkup right before the scripts or </body>
    const insertPoint = content.lastIndexOf('<script ');
    if (insertPoint !== -1) {
        content = content.substring(0, insertPoint) + '\n' + modalsMarkup + '\n    ' + content.substring(insertPoint);
    } else {
        content = content.replace('</body>', `\n${modalsMarkup}\n</body>`);
    }

    // Sync Theme Script in <head>
    if (themeScriptMarkup) {
        // Remove old theme script if exists
        content = content.replace(/<!-- Theme Initialization Script \(Prevent FOUC\) -->[\s\S]*?<\/script>/g, '');
        // Inject into <head> (before closing </head>)
        content = content.replace('</head>', `${themeScriptMarkup}\n</head>`);
    }

    // Ensure <body> doesn't have light-mode hardcoded
    content = content.replace(/<body class="light-mode">/g, '<body>');

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done syncing HTML components.');
