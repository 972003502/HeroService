const http = require('http');
const fs = require('fs');

http.createServer(function (request, response) {
  const html = fs.readFileSync('testServer/test.html', 'utf8');
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.end(html);
}).listen(3001);