const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');


function runCommand(cwd, commands) {
    for (const command of commands) {
        console.log(`Running command: ${command}`);
        execSync(command, { cwd, stdio: 'inherit' });
    }
}

runCommand(__dirname, [
    'git submodule update --force',
]);

const submodulePath = path.resolve(__dirname, 'packages/graphic-walker');

runCommand(submodulePath, [
    'git reset --hard',
]);

const { version, scripts } = JSON.parse(
    fs.readFileSync(path.join(submodulePath, 'packages/graphic-walker', 'package.json'), 'utf8')
);

fs.writeFileSync(
    path.join(submodulePath, 'packages/graphic-walker', 'package.json'),
    JSON.stringify({
        ...JSON.parse(fs.readFileSync(path.join(submodulePath, 'packages/graphic-walker', 'package.json'), 'utf8')),
        scripts: {
            ...scripts,
            build: 'yarn vite build',
        },
    }, null, 2),
);

const nextVersion = version.includes('-') ? version.split('-')[0] : (v => {
    const [major, minor, patch] = v.split('.');
    return `${major}.${minor}.${Number(patch) + 1}`;
})(version);
const snapshotVersion = `${nextVersion}-snapshot.${Math.floor(Date.now() / 1000)}`;

runCommand(path.join(submodulePath, 'packages/graphic-walker'), [
    'yarn install',
    `yarn version --new-version ${snapshotVersion} --no-git-tag-version`,
    'yarn build',
    'yarn pack',
]);

const packName = `kanaries-graphic-walker-v${snapshotVersion}.tgz`;

const packPath = path.resolve(submodulePath, 'packages/graphic-walker', packName);

runCommand(__dirname, [
    `yarn workspace web-app add @kanaries/graphic-walker@file:${packPath} --no-lockfile --no-save`,
]);
