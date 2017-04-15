const express = require('express');
const phantom = require('phantom');
const uuidV4 = require('uuid/v4');
const path = require('path');

const app = express();
const PORT = process.env.NODE_ENV == 'production' ? 8080 : 3000 ;
const initViewPort = {width: 1360, height: 768};
const assets_dir = path.join(__dirname, '../assets');

const generateName = () => (`${uuidV4()}.png`)

const takePhoto = (url, viewport = initViewPort ) => {
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

app.use('/shots', express.static('assets'))

app.get('/screenshot', (req, res) => {
	takePhoto(req.query.url)
		.then(name => res.status(200).sendFile(assets_dir + '/' + name))
		.catch(msg => res.status(400).json({msg}))
})

// listen on port

app.listen(PORT, () => console.log('Bring it on at ' + PORT))