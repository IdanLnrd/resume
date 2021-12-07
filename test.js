const pdfExractor = require('./extractors/PDFExtractor');
const docExtractor = require('./extractors/DOCEctractor');
const { similarity } = require('@nlpjs/similarity');
const base = '/Users/idangibly/Documents/GitHub/unboxable-cv-parser/data';
const path = {
    doc: `${base}/5Edwardo.doc`,
    pdf: `${base}/1Amy.pdf`,
    docx: `${base}/1Amy.docx`
};

function cleanText(text) {
    return  text.replace(/•+|!+/igu, '').replace(/\s+/mgiu, ' ').toLowerCase();
}

(async () => {
const text1 = await pdfExractor.getText(path.pdf);
const clean1 = cleanText(text1);
const text2 = await docExtractor.getText(path.docx);
const clean2 = cleanText(text2);
console.log(clean1);
//    const text1 = cleanText(await pdfExractor.getText(path.pdf));
//    console.log(text1);
//    console.log();
//    const text2 = cleanText(await docExtractor.getText(path.doc));
//    console.log(text2);
//    console.log();
//    const text3 = cleanText(await docExtractor.getText(path.docx));
//    console.log(text3);
})();