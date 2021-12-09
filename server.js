
require('dotenv').config();

// const { 
//     execSync 
// } = require("child_process");
const express = require('express');
const cors = require('cors');
const {existsSync, readdirSync, readFileSync } = require('fs');
const { resolve } = require('path');
const {
    PORT,
    CV_DIR,
    PUBLIC_DIR,
    CLEAN_CV_DIR,
    UPLOAD_CV_DIR
} = process.env;
const { SentimentAnalyzer } = require('node-nlp');
const sentiment = new SentimentAnalyzer({ language: 'en' });
// function getParsedResume(filename) {
//     const cvCommand = `python3 ${__dirname}/main.py '${filename}'`
//     const result = execSync(cvCommand);
//     return (result.toString())
// }

const {
    parseCV
} = require('./sovren');

const multer = require('multer');
const upload = multer({
  dest: `${UPLOAD_CV_DIR}/`
}); 

async function getParsedResumeBySovren(path) {
    return await parseCV(path);
}

const app = express();
app.use(cors());

app.get('/list/cv', (req, res) => {
    const dir = readdirSync(`${__dirname}/data`);
    const pdfs = dir.filter(f => f.endsWith('.pdf'));
    return res.json({ 
        err: '', 
        result: pdfs.slice(0, 50), 
        input: null 
    })
});

app.post('/uploadcv', upload.single('file-to-upload'), (req, res) => {
    res.redirect(`/?file=${req.file?.originalname}`);
});

app.get('/parse/cv/:name', (req, res) => {
    const {name} = req.params;
    const datapath = `${__dirname}/${CV_DIR}/${name}`;
    const uploadedpath = `${__dirname}/${UPLOAD_CV_DIR}/${name}`;
    const dexists = existsSync(datapath);
    const uexists = existsSync(uploadedpath);
   
    if(!dexists && !uexists) {
        return res.json({ err: 'file not exists', result: null, input: name });
    }
    const path = dexists ? datapath : uploadedpath;
    getParsedResumeBySovren(path).then(result => {
        return res.json({ err: '', result, input: name });
    });
});

app.get('/parsed/cv/clean/random', (req, res) => {
   
    const cleanPath = resolve(__dirname, CLEAN_CV_DIR);
    let result = null;
    const exists = existsSync(cleanPath);
    if(!exists) {
        return res.json({ 
            err: 'file not exists', 
            result, 
            input: null 
        })
    }

    const files = readdirSync(cleanPath);
    const count = files.length;
    const randomIndex = Math.floor(count * Math.random());
    const file = files[randomIndex];
    const fullPath = resolve(cleanPath, file);
    if(existsSync(fullPath)) {
        const text = readFileSync(fullPath)?.toString('utf-8') || '';
        sentiment
            .getSentiment(text)
            .then(data => {
                return res.json({ err: '', result: { 
                    sentiment: data, 
                    text 
                }, input: null });
            })
            .catch(err => res.json({ 
                err: 'error sentiment: ' + err , 
                result: null, 
                input: null 
            }));
    } else {
        return res.json({ 
            err: 'file not exists - ' + fullPath, 
            result, 
            input: null 
        })
    }
});

app.use('/cv', express.static(CV_DIR));

app.use(express.static('./node_modules'));
app.use(express.static(PUBLIC_DIR));
app.use(express.static(UPLOAD_CV_DIR));
app.listen(PORT, 
    () => console.log(`server running on port: ${PORT}`)
);

// getParsedResume(`${__dirname}/../data/1Amy.pdf`);
 