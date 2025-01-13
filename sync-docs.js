// sync-docs.js
const fs = require('fs-extra');
const path = require('path');

const centralDocsPath = path.join(__dirname, 'docs');
const appsPath = path.join(__dirname, 'apps');
const packagesPath = path.join(__dirname, 'packages');

async function copyFiles(source, target) {
    const items = await fs.readdir(source);

    for (let item of items) {
        const s = path.join(source, item);
        const t = path.join(target, item);

        const stats = await fs.stat(s);

        if (stats.isDirectory()) {
            // If directory does not exist in target, create it
            if (!fs.existsSync(t)) {
                await fs.mkdir(t);
            }
            await copyFiles(s, t); // Recursively copy the contents of the directory
        } else {
            // Copy file to target
            await fs.copy(s, t);
            console.log(`Copied ${item} to central docs folder.`);
        }
    }
}

async function syncDocs() {
    if (!fs.existsSync(centralDocsPath)) {
        await fs.mkdir(centralDocsPath);
    }

    const appsItems = await fs.readdir(appsPath);
    const packagesItems = await fs.readdir(packagesPath);

    for (let item of [...appsItems, ...packagesItems]) {
        let sourceBaseDir;
        if (fs.existsSync(path.join(appsPath, item, 'docs'))) {
            sourceBaseDir = appsPath;
        } else if (fs.existsSync(path.join(packagesPath, item, 'docs'))) {
            sourceBaseDir = packagesPath;
        } else {
            continue; // Skip if there is no docs directory
        }

        const packageDocsPath = path.join(sourceBaseDir, item, 'docs');
        const targetPath = path.join(centralDocsPath, sourceBaseDir.split(path.sep).pop(), item);

        if (fs.existsSync(packageDocsPath)) {
            // Ensure the target directory exists
            if (!fs.existsSync(targetPath)) {
                await fs.mkdirp(targetPath); // Using mkdirp to create all intermediate directories as needed
            }

            await copyFiles(packageDocsPath, targetPath);
        }
    }

    console.log("Documentation sync complete.");
}

// Run the sync function
syncDocs();