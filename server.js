
require('dotenv').config();
const { 
    execSync 
} = require("child_process");
const express = require('express');
const cors = require('cors');
const {existsSync, readdirSync } = require('fs');
const {
    PORT,
    CV_DIR,
    PUBLIC_DIR
} = process.env;

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

app.use('/cv', express.static(CV_DIR));

app.use(express.static(PUBLIC_DIR));
app.listen(PORT, 
    () => console.log(`server running on port: ${PORT}`)
);

// getParsedResume(`${__dirname}/../data/1Amy.pdf`);
 