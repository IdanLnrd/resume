require('dotenv').config();
const { 
    readdirSync, 
    rmdirSync, 
    existsSync, 
    writeFileSync, 
    mkdirSync,
    readFileSync 
} = require('fs');

const { resolve , extname, basename } = require('path');
const { CV_DIR, CLEAN_CV_DIR } = process.env;
const pdfExtractor = require('./extractors/PDFExtractor');
const docExtractor = require('./extractors/DOCEctractor');

function cleanText(text) {
    return  (text || '')
        .replace(/•+|!+/mgiu, '')
        .replace(/\s+/mgiu, ' ')
        .toLowerCase();
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
    
    const count = cvpaths.length;
    let progress = 1;
    const n = String(count).length;

    for(const cv of cvpaths) {
 
        
        ext = extname(cv);
      
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
        console.clear();        
        const ratio = Math.floor(50 * (progress++ / count));
        const progressString = "|".repeat(ratio);
        console.log(`Cleaning cv files (${ratio * 2}%)`);
        console.log(progressString.padEnd(50, ":"));
        console.log();
    }




};

run();