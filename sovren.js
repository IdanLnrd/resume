require('dotenv').config();
const { SOVREN_API_KEY, SOVREN_ACCOUNT_ID } = process.env;
const http = require('https');
const fs = require('fs');

const httpStatusCodes = {
    OK: 200
}

class Sovren {


parseCV(filePath) {
    return new Promise(resolve => {
        const buffer = fs.readFileSync(filePath);
        const base64Doc = buffer.toString('base64');
         
        const modifiedDate = (new Date(fs.statSync(filePath).mtimeMs)).toISOString().substring(0, 10);
        const postData = JSON.stringify({
          'DocumentAsBase64String': base64Doc,
          'DocumentLastModified': modifiedDate
        });
        const options = {
          host: 'rest.resumeparsing.com',
          protocol: 'https:',
          path: '/v10/parser/resume',
          method: 'POST',
          headers: {
              'Sovren-AccountId': String(SOVREN_ACCOUNT_ID),
              'Sovren-ServiceKey': String(SOVREN_API_KEY),
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData)
          }
        };
         
        const request = http.request(options, function (response) {
            const status = response.statusCode;      
            if(status !== httpStatusCodes.OK) {
                console.error('status not ok');
                    return resolve();
            }
            
            response.setEncoding('utf8');
            
            let responseAsString = '';
            
            response.on('data', (chunk) => {
                responseAsString += chunk;
            });
            
            response.on('end', () => {
                const responseAsJson = JSON.parse(responseAsString);
                resolve(responseAsJson);        
            });

            response.on('error', err => {
                console.error('err:', err);
                resolve();
            });
            });
            
            request.write(postData);
            request.end();
    });
   
}


}


const sovern = new Sovren();

module.exports = {
    parseCV: sovern.parseCV
};