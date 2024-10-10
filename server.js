// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 3000;

const getPath = (url) => {
    // 请求静态资源时，路径直接拼接；否则发送index.html
    if (/.(js|css|png|jpg|svg|json|ico|txt|map|woff|woff2|eot)$/.test(url)) {
        return path.join(__dirname, `/front${url}`)
    }
    return path.join(__dirname, '/front/index.html')
};
const getType = (url) => {
    // 请求静态资源时，路径直接拼接；否则发送index.html
    if (/.(js|css|png|jpg|svg|json|ico|txt|map|woff|woff2|eot)$/.test(url)) {
        return "file"
    }
    return "page"
};

const server = http.createServer((req, res) => {
    const thePath = getPath(req.url);
    console.log(thePath);

    fs.readFile(thePath, getReadFileOptions(req.url), (err, data) => {
        if (err) {
            handleFileReadError(res, err);
        } else {
            setResponseHeaders(req, res);
            res.end(data);
        }
    });
});

const handleFileReadError = (res, err) => {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('An error occurred while reading the file: ' + err.message);
};

const getReadFileOptions = (url) => {
    return /\.js$|\.css$/.test(url) ? 'utf-8' : null;
};

const setResponseHeaders = (req, res) => {
    if (getType(req.url) === "page") {
        res.writeHead(200, {'Content-Type': 'text/html'});
    } else {
        res.writeHead(200, {'Content-Type': getContentType(req.url)});
    }
};

const getContentType = (url) => {
    switch (path.extname(url)) {
        case '.js':
            return 'application/javascript';
        case '.css':
            return 'text/css';
        case '.png':
            return 'image/png';
        case '.jpg':
            return 'image/jpeg';
        case '.svg':
            return 'image/svg+xml';
        case '.json':
            return 'application/json';
        case '.ico':
            return 'image/x-icon';
        case '.txt':
            return 'text/plain';
        default:
            return 'application/octet-stream';
    }
};

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
