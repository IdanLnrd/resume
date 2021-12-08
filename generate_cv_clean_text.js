require('dotenv').config();
const { readdirSync, rmdirSync, existsSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { resolve , extname } = require('path');
const { CV_DIR, CLEAN_CV_DIR } = process.env;

const prepare = () => {
    const raw = resolve(__dirname, CV_DIR);
    const clean = resolve(__dirname, CLEAN_CV_DIR);
    if(!existsSync(raw)) {
        console.error(raw + ' not  exsits.');
        return {};
    }
    if(existsSync(clean)) {
        rmdirSync(clean, { recursive: true, force: true });
    }
    mkdirSync(clean);
    return { raw, clean };
}

const ext = [
    '.pdf',
    '.doc',
    '.docx',
    '.txt'
];

(async () => {
    const { raw, clean } = prepare();
    if(!raw || !clean) {
        return console.log('missing path:', { raw, clean });
    }
    const cvpaths = readdirSync(raw).map(r => resolve(raw, r));
    const invalidFiles = cvpaths.filter(
        p => !ext.includes(extname(p))
    );
    invalidFiles.forEach(f => rmSync(f));
    console.log(invalidFiles);
})();