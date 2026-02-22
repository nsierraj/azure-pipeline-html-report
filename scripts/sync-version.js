/**
 * Syncs the version from the root package.json to all other version-bearing files.
 * Run automatically via the "version" npm lifecycle hook (triggered by `npm version`).
 * Can also be run manually: node scripts/sync-version.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const [Major, Minor, Patch] = pkg.version.split('.').map(Number);

// azure-devops-extension.json
const extPath = path.join(root, 'azure-devops-extension.json');
const ext = JSON.parse(fs.readFileSync(extPath, 'utf8'));
ext.version = pkg.version;
fs.writeFileSync(extPath, JSON.stringify(ext, null, 4) + '\n');

// PublishHtmlReport/task.json
const taskPath = path.join(root, 'PublishHtmlReport', 'task.json');
const task = JSON.parse(fs.readFileSync(taskPath, 'utf8'));
task.version = { Major: String(Major), Minor: String(Minor), Patch: String(Patch) };
fs.writeFileSync(taskPath, JSON.stringify(task, null, 2) + '\n');

// PublishHtmlReport/package.json
const taskPkgPath = path.join(root, 'PublishHtmlReport', 'package.json');
const taskPkg = JSON.parse(fs.readFileSync(taskPkgPath, 'utf8'));
taskPkg.version = pkg.version;
fs.writeFileSync(taskPkgPath, JSON.stringify(taskPkg, null, 2) + '\n');

console.log(`Version synced to ${pkg.version}`);
