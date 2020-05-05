const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
class Server { }
let mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

let folderName = 'public'
let loadedFiles = {}

http.createServer((request, response) => {
    let filePath = `./${folderName}`
    if (request.url == '/') {
        filePath = `./${folderName}/index.html`;
    } else {
        filePath += `${request.url}`
    }
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    console.log('contentType', contentType)
    if (loadedFiles[filePath] != undefined) {
        console.log(filePath + " loaded from cache")
        sendContent(loadedFiles[filePath]);
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                response.writeHead(404);
                response.end('File not found: ');
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            console.log(filePath + " loaded from disk")
            //caching all files (text files & all binary files) 
            loadedFiles[filePath] = content;
            sendContent(content);
        }

    });

    function sendContent(content) {
        response.writeHead(200, {
            'Content-Type': contentType
        });
        response.end(content, 'utf-8');
    }

}).listen(8080, () => {
    console.log('Server running at http://127.0.0.1:8080/');
    console.log('Or go to http://localhost:8080/');
});
