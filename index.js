require("dotenv").config();
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const app = require('./filemanager');
const uploadDir = process.env.UPLOAD_DIRECTORY || require("os").tmpdir();
const owner = {
	username: process.env.USERNAME,
	password: process.env.PASSWORD
}

// For filemanager
module.exports.base = uploadDir;
module.exports.password = owner.password;

if (!owner.username || !owner.password) {
	console.error("One of your credentials (username or password) is missing.");
	console.error("For security reason, It's VERY IMPORTANT TO FILL THESE CREDENTIALS.");
	console.error("\nPlease fill all of those credentials and Try again.");
	process.exit(1);
}

if (!fs.existsSync(uploadDir)) {
	try {
		fs.mkdirSync(uploadDir);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

const server = http.createServer(function (req, res, next) {
  if (!fs.existsSync(uploadDir)) {
  	try {
  		fs.mkdirSync(uploadDir);
  	} catch (error) {
  		console.error(error);
  	}
  }

  if (req.url.startsWith("/manager") || req.url.startsWith("/vs") || req.url.startsWith("/ApiPath.js") || req.url.startsWith("/api") || req.url.startsWith("/password")) {
	if (req.url.startsWith("/manager")) req.url = req.url.slice(8);
	if (!req.url) req.url = "/";
  	return app(req, res, next);
  }
  // Because we don't need query, So we just make it as normal request.
  req.url = req.url.split("?")[0];
  if (req.url == '/upload' && req.method === "POST") {
    let form = new formidable.IncomingForm({
    	uploadDir,
    	allowEmptyFiles: false,
    });
    form.parse(req, function (err, fields, files) {
      if (!fields.password || !fields.username || fields.username != owner.username || fields.password != owner.password || !files.file) {
      	res.statusCode = 401;
      	return res.end("Invalid Credentials.");
      }
      let oldpath = files.file.path;
      let newpath = `${uploadDir}/${Math.random().toString(36).slice(5)}.${files.file.name.split(".")[files.file.name.split(".").length-1]}`;
      if (!fs.existsSync(uploadDir)) {
      	try {
      		fs.mkdirSync(uploadDir);
      	} catch (error) {
      		res.statusCode = 500;
      		res.end("Something went wrong. Try again later.");
      		console.error(error);
      		return;
      	}
      }
      let path = newpath.split("/");
      let filename = path.filter(u => u == path[path.length-1])[0]
      fs.writeFileSync(`${uploadDir}/${filename}.type`, files.file.type);
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
        	res.statusCode = 500;
        	res.end("Something went wrong. Try again later.");
        	return console.error(err);
        }
        res.setHeader("content-type", "text/plain");
        res.write(`Here's your Generated URL:\n`);
        res.end(`http://${req.headers["host"]}/u/${newpath.split("/")[newpath.split("/").length-1]}`);
      });
 	});
  } else if (req.url.startsWith("/u/") && req.method === "GET") {
		try {
  			let filename = req.url.split("/u/").filter(u => u.length > 0)[0];
  			try {
  				let type = fs.readFileSync(`${uploadDir}/${filename}.type`, "utf8");
				res.setHeader("content-type", type);
				fs.createReadStream(`${uploadDir}/${filename}`).pipe(res);
			} catch (error) {
				res.writeHead(404, { "content-type": "text/html" });
				res.write("<div style=\"font-family: helvetica;\" align=\"center\"><h1>404</h1>");
				res.write("<h3>File not found</h3>");
				res.end("<p>A file that you tried to access is unavailable, Or removed by Website Administrator.</p></div>");
			}
		} catch (error) {
			console.log(error);
			res.writeHead(301, { "Location": "/" });
			res.end();
		}
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream("upload.html").pipe(res);
  }
});

const listener = server.listen(process.env.PORT || 3000, () => {
	console.log(`[File] Now Hosting ${fs.readdirSync(uploadDir, { withFileTypes: true }).filter(item => item.isFile && !item.name.endsWith(".type")).map(item => item.name).length} files.`);
	console.log("Your app is now listening on port", listener.address().port);
});
