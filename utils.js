const { existsSync, readdirSync, readFileSync } = require('fs');
const { resolve } = require('path');

module.exports = {
    readRandomFile: (baseDir) => {
        if(!existsSync(baseDir)) {
            return '';
        }
        const files = readdirSync(baseDir);
        const filename = files[Math.floor(files.length * Math.random())];
        if(filename) {
            return readFileSync(resolve(baseDir, filename));
        }
        return '';
    },
    getRandomFilePath: (baseDir) => {
        if(!existsSync(baseDir)) {
            return '';
        }
        const files = readdirSync(baseDir);
        const filename = files[Math.floor(files.length * Math.random())];
        if(filename) {
            return resolve(baseDir, filename);
        }
        return '';
    }
};