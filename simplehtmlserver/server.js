const http = require('http');
const hostname = '127.0.0.1';
const port = 3001;
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimetypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg":"image/jpg",
	"png": "image/png",
	"js": "text/javascript",
	"css":"text/css"
}

const server = http.createServer((req, res)=>{
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log(`loading ${uri}`);
	var stats;
	try{
		stats = fs.lstatSync(fileName);
	}catch(e){
		res.writeHead(404, {'Content-type': 'text/plain'});
		res.write('404 not found\n');
		res.end();
		return;
	}
	if (stats.isFile()) {
		var mimeType = mimetypes[path.extname(fileName).split('.').reverse()[0]];
		res.writeHead(200, {'Content-type': mimeType});
		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	}else if (stats.isDirectory()) {
		res.writeHead(302, {'Location': 'index.html'});
		res.end();
	}else{
		res.writeHead(500, {'Content-type': 'text/plain'});
		res.write('500 internal server error\n');
		res.end();
	}
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});