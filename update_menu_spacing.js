const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'about.html',
    'contact.html',
    'e-commerce.html',
    'mobile-app-development.html',
    'cms-development.html',
    'digital-marketing.html',
    'domain-and-web-hosting.html',
    'sap-business-one.html',
    'business-intelligence-tool.html',
    'third-party-app-integration.html',
    'crm.html',
    'business-process-automation.html',
    'it-support.html',
    'it-consulting.html',
    'back-office-support.html',
    'website-development.html'
];

const workspaceDir = 'c:\\Users\\DELL\\OneDrive\\Desktop\\tekhive';

// Match from '<div class="flex justify-between py-16">' down to the closing of the lottiePreview container
const megaMenuBlockPattern = /<div class="flex justify-between py-16">[\s\S]*?<div id="lottiePreview"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi;

try {
    const servicesPath = path.join(workspaceDir, 'services.html');
    const servicesContent = fs.readFileSync(servicesPath, 'utf8');
    const match = servicesContent.match(megaMenuBlockPattern);
    
    if (!match) {
        console.error('Could not find the target Mega Menu block in services.html');
        process.exit(1);
    }
    
    const targetReplacement = match[0];
    console.log('Successfully extracted updated Mega Menu block from services.html.');
    
    files.forEach(fileName => {
        const filePath = path.join(workspaceDir, fileName);
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }
        
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            if (megaMenuBlockPattern.test(content)) {
                content = content.replace(megaMenuBlockPattern, targetReplacement);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Successfully updated: ${fileName}`);
            } else {
                console.log(`Mega Menu block pattern not matched in: ${fileName}`);
            }
        } catch (err) {
            console.error(`Error processing ${fileName}:`, err);
        }
    });
} catch (err) {
    console.error('Failed to run migration:', err);
}
