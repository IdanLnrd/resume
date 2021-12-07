const pdf = require('pdf-to-text');
class PDFExtractor {
    async getText(path) {
        return new Promise(resolve => {
            pdf.pdfToText(path, (err, data) => {
                if(err) {
                    console.error(err);
                    resolve();
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = new PDFExtractor();