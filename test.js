// const pdfUtil = require('pdf-to-text');
// const pdf_path = "/Users/idangibly/Documents/GitHub/unboxable-cv-parser/data/1Amy.pdf";
 
// pdfUtil.pdfToText(pdf_path, function(err, data) {
//     if (err) throw(err);
      
//   });

const doc_path = "/Users/idangibly/Documents/GitHub/unboxable-cv-parser/data/5Edwardo.doc";
const WordExtractor = require("word-extractor"); 
const extractor = new WordExtractor();
const extracted = extractor.extract(doc_path);
extracted.then(function(doc) { console.log(doc.getBody()); });