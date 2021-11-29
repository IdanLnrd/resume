
require('dotenv').config();
const { 
    execSync 
} = require("child_process");
const express = require('express');
const cors = require('cors');
const { readFileSync, existsSync, readdirSync } = require('fs');
const {
    PORT,
    PUBLIC_DIR
} = process.env;

function getParsedResume(filename) {
    const cvCommand = `python3 ${__dirname}/main.py '${filename}'`
    const result = execSync(cvCommand);
    return (result.toString())
}

const app = express();
app.use(cors());
app.use(express.static(PUBLIC_DIR));

app.get('/list/cv', (req, res) => {
    const dir = readdirSync(`${__dirname}/data`);
    const pdfs = dir.filter(f => f.endsWith('.pdf'));
    return res.json({ 
        err: '', 
        result: pdfs.slice(0, 50), 
        input: null 
    })
});

app.get('/parse/cv/:path', (req, res) => {
    const path = req.params.path;
    const exists = existsSync(path);
    let result = null;
    if(!exists) {
        return res.json({ err: 'file not exists', result, input: path })
    }
    result = getParsedResume(path);
    return res.json({ err: '', result, input: path });
});

app.listen(PORT, 
    () => console.log(`server running on port: ${PORT}`)
);

// getParsedResume(`${__dirname}/../data/1Amy.pdf`);
 