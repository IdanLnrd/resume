const { execSync } = require("child_process");

function getParsedResume(filename) {
    const cvCommand = `python3 ${__dirname}/main.py '${filename}'`
    const result = execSync(cvCommand);
    return (result.toString())
}

// getParsedResume(`${__dirname}/../data/1Amy.pdf`);

