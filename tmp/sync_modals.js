const fs = require('fs');
const path = require('path');

const rootHtmlPath = 'Sinh Portfolio web/index.html';
const rootHtml = fs.readFileSync(rootHtmlPath, 'utf8');

// 1. Extract the Header
const headerMatch = rootHtml.match(/<header[\s\S]*?<\/header>/);
const headerMarkup = headerMatch ? headerMatch[0] : '';
if (!headerMarkup) throw new Error("Could not find <header> in root index.html");

// 2. Extract the Theme Initialization Script
const themeScriptMatch = rootHtml.match(/<!-- Theme Initialization Script \(Prevent FOUC\) -->[\s\S]*?<\/script>/);
const themeScriptMarkup = themeScriptMatch ? themeScriptMatch[0] : '';

// 3. Extract the Modals & UI Controls
const modalsStartStr = '<!-- Fixed UI Controls -->';
const modalsEndStr = '<!-- Use CDN GSAP';
let modalsIndexStart = rootHtml.indexOf(modalsStartStr);
let modalsIndexEnd = rootHtml.indexOf(modalsEndStr);
if (modalsIndexEnd === -1) modalsIndexEnd = rootHtml.lastIndexOf('<script ');

if (modalsIndexStart === -1 || modalsIndexEnd === -1) throw new Error("Could not find modals block in root index.html");
const modalsMarkup = rootHtml.substring(modalsIndexStart, modalsIndexEnd);

// Helper to fix paths
function adjustPaths(html, depth) {
    if (depth === 0) return html;
    const prefix = '../'.repeat(depth);
    
    // Fix src="..." and href="..." that don't start with http, /, or #
    return html.replace(/(src|href)="([^"h/#][^"]*)"/g, (match, p1, p2) => {
        // Skip paths that already have many ../
        if (p2.startsWith('../')) return match; 
        return `${p1}="${prefix}${p2}"`;
    });
}

function findHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (path.normalize(filePath) === path.normalize(rootHtmlPath)) continue; 
        
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const targetDirs = ['Sinh Portfolio web/portfolio', 'Sinh Portfolio web/services'];
const allHtmlFiles = [];
targetDirs.forEach(d => findHtmlFiles(d, allHtmlFiles));

allHtmlFiles.forEach(filePath => {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');

    // Calculate depth relative to "Sinh Portfolio web"
    const relativePath = path.relative('Sinh Portfolio web', filePath);
    const depth = relativePath.split(path.sep).length - 1;
    const prefix = '../'.repeat(depth);

    // --- SYNC HEADER ---
    const localHeaderMarkup = adjustPaths(headerMarkup, depth);
    // Replace existing header
    content = content.replace(/<header[\s\S]*?<\/header>/, localHeaderMarkup);

    // --- SYNC THEME SCRIPT ---
    if (themeScriptMarkup) {
        const localThemeScript = adjustPaths(themeScriptMarkup, depth);
        // Remove old if exists
        content = content.replace(/<!-- Theme Initialization Script \(Prevent FOUC\) -->[\s\S]*?<\/script>/g, '');
        // Inject before </head>
        content = content.replace('</head>', `${localThemeScript}\n</head>`);
    }

    // --- SYNC MODALS ---
    // Remove all old modal blocks
    const blocksToRemove = [
        /<!-- Fixed UI Controls -->[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+class="ui-controls"[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+id="chatbot-container"[\s\S]*?(?=<script|<\/body)/g,
        /<!-- Chatbot AI Local -->[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+id="auth-modal-overlay"[\s\S]*?(?=<script|<\/body)/g,
        /<!-- Auth Modal Overlay -->[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+id="topup-modal-overlay"[\s\S]*?(?=<script|<\/body)/g,
        /<!-- User Dashboard Modal Overlay -->[\s\S]*?(?=<script|<\/body)/g,
        /<div\s+id="dashboard-modal-overlay"[\s\S]*?(?=<script|<\/body)/g,
    ];
    blocksToRemove.forEach(regex => { content = content.replace(regex, ''); });

    const localModalsMarkup = adjustPaths(modalsMarkup, depth);
    const insertPoint = content.lastIndexOf('<script ');
    if (insertPoint !== -1) {
        content = content.substring(0, insertPoint) + '\n' + localModalsMarkup + '\n    ' + content.substring(insertPoint);
    } else {
        content = content.replace('</body>', `\n${localModalsMarkup}\n</body>`);
    }

    // --- STANDARDIZE SCRIPTS & CSS ---
    // Update style.css version
    content = content.replace(/href="[^"]*style\.css[^"]*"/, `href="${prefix}style.css?v=restore-elite-v4"`);
    // Update script.js version and ensure it's at the end
    content = content.replace(/<script\s+src="[^"]*script\.js[^"]*"><\/script>/g, ''); // Remove duplicates
    content = content.replace('</body>', `    <script src="${prefix}script.js?v=restore-elite-v4"></script>\n</body>`);

    // Ensure <body> is clean
    content = content.replace(/<body class="light-mode">/g, '<body>');

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log(`Successfully synced ${allHtmlFiles.length} files.`);
