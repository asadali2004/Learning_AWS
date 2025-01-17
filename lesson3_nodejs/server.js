const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    res.end('Welcome to the home page!');
  } else if (req.method === 'GET' && req.url === '/about') {
    res.statusCode = 200;
    res.end('This is the about page.');
  } else {
    res.statusCode = 404;
    res.end('Page not found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});