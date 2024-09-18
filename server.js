// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 3000;

const getPath  = (url) => {
    // 当请求根路径时，发送index.html
    if (url === "/") return path.join(__dirname, '/front/index.html');
    else return path.join(__dirname, `/front${url}`);
}

const server = http.createServer((req, res) => {
    const thePath = getPath(req.url);
    console.log(thePath);
    const options = /.js|.css$/.test(req.url) ? "utf-8" : null;
    fs.readFile(thePath, options, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('An error occurred while reading the file.');
        } else {
            if (req.url === "/") {
                res.writeHead(200, { 'Content-Type': 'text/html' }); // 设置响应头部，告诉浏览器返回的是HTML内容
            } else {
                res.writeHead(200, {});
            }
            res.end(data); // 发送index.html文件的内容
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

