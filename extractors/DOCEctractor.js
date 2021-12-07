
const WordExtractor = require("word-extractor"); 

class DOCExtractor {
    async getText(path) {
        return new Promise(resolve => {
            const extractor = new WordExtractor();
            const extracted = extractor.extract(path);
            extracted.then(doc => {
                resolve(doc.getBody());
            }).catch(err => {
                console.error(err);
                resolve();
            });
          
        });
    }
}

module.exports = new DOCExtractor();