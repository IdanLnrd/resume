const pdfExractor = require('./extractors/PDFExtractor');
const docExtractor = require('./extractors/DOCEctractor');
const base = '/Users/idangibly/Documents/GitHub/unboxable-cv-parser/data';
const path = {
    doc: `${base}/5Edwardo.doc`,
    pdf: `${base}/1Amy.pdf`,
    docx: `${base}/1Amy.docx`
};
(async () => {
    const text1 = await pdfExractor.getText(path.pdf);
    console.log('\n===============================================\n');
    const text2 = await docExtractor.getText(path.doc);
    console.log('\n===============================================\n');
    const text3 = await docExtractor.getText(path.docx);
})();