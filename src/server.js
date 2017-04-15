const express = require('express');
const phantom = require('phantom');
const uuidV4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.NODE_ENV == 'production' ? 8080 : 3000 ;
const initViewPort = {width: 1360, height: 768};
const assets_dir = path.join(__dirname, '../assets');

const generateName = () => (`${uuidV4()}.png`)

const takePhoto = (url, viewport) => {
	console.log(viewport);
	return new Promise ((res, rej) => {
		let phInstance = null;

		phantom.create()
			.then(function (instance) {
				phInstance = instance;
				return instance.createPage();
			})
			.then(function (page) {
				page.property('viewportSize', viewport).then(function() {
					page.open(url)
						.then(function (status) {
							if(status != 'fail') {
								let filename = generateName();
								let path = assets_dir + '/' + filename;
								page.render(path)
									.then(function () {
										phInstance.exit();
										return res(filename);
									});
							} else {
								return rej('Failed! Make sure you entered a valid url');
								phInstance.exit();
							}
						})
				});
			})
			.catch(function (error) {
				return rej(error);
				phInstance.exit();
			});
	})
}

const convert_to_base64 = (path) => {

	return new Promise ((res, rej) => {
		fs.readFile(path, (err, data) => {
			if(err) {
				return rej(err);
			}

			return res(data.toString('base64'));
		})
	})

}

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
})

app.use('/shots', express.static('assets'))

app.get('/screenshot', (req, res) => {

	let {url, width = initViewPort.width, height = initViewPort.height, format = 'raw'} = req.query

	takePhoto(url, {
			width,
			height
		})
		.then(name => {
			let path_to_file = assets_dir + '/' + name;
			console.log(format)
			switch (format) {
				case 'raw':
					return res.status(200).sendFile(path_to_file);
				case 'base64':
					return convert_to_base64(path_to_file)
						.then(data => res.status(200).json({src: data}))
						.catch(err => res.status(200).json(msg));
				default:
					return res.status(200).sendFile(path_to_file);

			}
		})
		.catch(msg => res.status(400).json({msg}))
})

// listen on port

app.listen(PORT, () => console.log('Bring it on at ' + PORT))