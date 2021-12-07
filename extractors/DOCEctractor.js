
const WordExtractor = require("word-extractor"); 

class DOCExtractor {
    async getText(path) {
        return new Promise(resolve => {
            const extractor = new WordExtractor();
            const extracted = extractor.extract(path);
            const doc = await extracted;
            resolve(doc.getBody());
        });
    }
}

module.exports = new DOCExtractor();