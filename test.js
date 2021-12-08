require('dotenv').config();
const { CV_DIR } = process.env;
const { resolve } = require('path');
const { getRandomFilePath } = require('./utils');
const { StopwordsEn, TokenizerEn } = require('@nlpjs/lang-en');
const pdfExtractor = require('./extractors/PDFExtractor');
const stopwords = new StopwordsEn();
const tokenizer = new TokenizerEn();
const cvpath = resolve(__dirname, CV_DIR);

const test1 = async () => {
    const filepath = getRandomFilePath(cvpath);
    const pdftext = await pdfExtractor.getText(filepath);
    const result = tokenizer.tokenize(pdftext, true);
    const tokens = stopwords.removeStopwords(result);
    console.log(tokens);    
};

const test2 = async () => {
    const { NlpManager } = require('node-nlp');

    (async () => {
    let manager = new NlpManager({ 
        languages: ['en'], 
        forceNER: true, 
        ner: { useDuckling: false } });
    const result = await manager.process(
        '2019 - 2022'
    );
    console.log(JSON.stringify(result, null, 2));
    })();
}

test2();