const pdfExractor = require('./extractors/PDFExtractor');
const docExtractor = require('./extractors/DOCEctractor');

const base = '/Users/idangibly/Documents/GitHub/unboxable-cv-parser/data';
const path = {
    doc: `${base}/5Edwardo.doc`,
    pdf: `${base}/1Amy.pdf`,
    docx: `${base}/1Amy.docx`
};

function cleanText(text) {
    return  text.replace(/•/igu, '').replace(/\s+/mgiu, ' ').toLowerCase();
}

(async () => {

//    const text1 = cleanText(await pdfExractor.getText(path.pdf));
//    console.log(text1);
//    console.log();
//    const text2 = cleanText(await docExtractor.getText(path.doc));
//    console.log(text2);
//    console.log();
//    const text3 = cleanText(await docExtractor.getText(path.docx));
//    console.log(text3);
})();