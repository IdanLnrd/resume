
require('dotenv').config();

const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ 
    languages: ['en'], 
    forceNER: true, 
    ner: { useDuckling: false } });

async function isDate(text) {
    const result = await manager.process(text);
    const isvalid = result.entities.map(en => en.accuracy)
        .filter(x => x >= 0.8).length > 0;
    return isvalid;
}

const { 
    execSync 
} = require("child_process");
const express = require('express');
const cors = require('cors');
const {existsSync, readdirSync, readFileSync } = require('fs');
const { resolve } = require('path');
const {
    PORT,
    CV_DIR,
    PUBLIC_DIR,
    CLEAN_CV_DIR
} = process.env;
const { SentimentAnalyzer } = require('node-nlp');
const sentiment = new SentimentAnalyzer({ language: 'en' });
function getParsedResume(filename) {
    const cvCommand = `python3 ${__dirname}/main.py '${filename}'`
    const result = execSync(cvCommand);
    return (result.toString())
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

app.get('/parse/cv/:name', (req, res) => {
    const name = req.params.name;
    const path = `${__dirname}/${CV_DIR}/${name}`;
    const exists = existsSync(path);
    let result = null;
    if(!exists) {
        return res.json({ err: 'file not exists', result, input: name })
    }
    result = getParsedResume(path);
    return res.json({ err: '', result, input: name });
});

app.get('/parse/cv/prof/:name', async (req, res) => {
    const { name } = req.params;
    if(!name) {
        return res.json({ 
            err: 'no name', result, input: name 
        });
    }
    const path = `${__dirname}/${CV_DIR}/${name}`;
    const exists = existsSync(path);
    let result = null;
    if(!exists) {
        return res.json({ 
            err: 'file not exists', result, input: name 
        });
    }
    const json = getParsedResume(path);
    const { experience } = JSON.parse(json)

    let exp = '';
    const experiences = [];
    for(const e of experience) {
        exp = (exp + e);
        if(await isDate(e)) {
            experiences.push(exp);
            exp = '';
        }
    }

    experiences.push(exp);

    return res.json({ 
        err: '', result: experiences, input: name 
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

app.use(express.static(PUBLIC_DIR));
app.listen(PORT, 
    () => console.log(`server running on port: ${PORT}`)
);

// getParsedResume(`${__dirname}/../data/1Amy.pdf`);
 