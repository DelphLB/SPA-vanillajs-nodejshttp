const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 9000;

let mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

let loadedFiles = {}

http.createServer(function (request, response) {
    console.log('request ', request.url);

    var filePath = './public';
    if (request.url == '/') {
        filePath += '/index.html';
    } else {
        filePath += request.url
    }

    var extname = String(path.extname(filePath)).toLowerCase();


    var contentType = mimeTypes[extname] || 'application/octet-stream';

    if (loadedFiles[filePath] != undefined) {
        console.log(filePath + " loaded from cache")
        sendContent(loadedFiles[filePath]);
        return;
    }

    fs.readFile(filePath, function (error, content) {
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
            //cache only text files, ignore all binary files
            loadedFiles[filePath] = content;
            sendContent(content);
        }
    });

    function sendContent(content) {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    }

}).listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
console.log('Or go to http://localhost:8080/');