require('dotenv').config();
const { readdirSync, rmdirSync, existsSync, writeFileSync, mkdirSync, rmSync, readFileSync } = require('fs');
const { resolve , extname } = require('path');
const { CV_DIR, CLEAN_CV_DIR } = process.env;
const pdfExtractor = require('./extractors/PDFExtractor');
const docExtractor = require('./extractors/DOCEctractor');
function cleanText(text) {
    return  text.replace(/•+|!+/igu, '').replace(/\s+/mgiu, ' ').toLowerCase();
}
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

const EXT = {
    pdf: '.pdf',
    doc: '.doc',
    docx: '.docx',
    txt: '.txt'
}

const extensions = Object.values(EXT);

const run = async () => {
    const { raw, clean } = prepare();
    if(!raw || !clean) {
        return console.log('missing path:', { raw, clean });
    }
    const cvpaths = readdirSync(raw).map(r => resolve(raw, r)).filter(
        p => extensions.includes(extname(p))
    )
    
    let text, ext;
    let counter = 0;
    const n = String(cvpaths.length).length;
    for(const cv of cvpaths) {
        ext = extname(cv);
        console.log(cv);
        if(ext === EXT.txt) {
            text = cleanText(readFileSync(cv)?.toString() || '');
        }
        if(ext === EXT.pdf) {
            text = cleanText(await pdfExtractor.getText(cv));
        }
        if((ext === EXT.docx) || (ext === EXT.doc)) {
            text = cleanText(await docExtractor.getText(cv));
        }
        if(text) {
            const newpath = resolve(clean, `${String(counter).padStart(n, 0)}${EXT.txt}`)
            writeFileSync(newpath, text);
            counter++;
        }
     
    }




};

run();