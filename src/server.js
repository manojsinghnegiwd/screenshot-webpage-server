const express = require('express');
const phantom = require('phantom');
const uuidV4 = require('uuid/v4');
const path = require('path');

const app = express();
const PORT = 3000;
const initViewPort = {width: 1360, height: 768};
const assets_dir = './assets';

const generateName = () => (`${uuidV4()}.png`)

const takePhoto = (url, viewport = initViewPort ) => {
	return new Promise ((res, req) => {
		let phInstance = null;

		phantom.create()
			.then(function (instance) {
				phInstance = instance;
				return instance.createPage();
			})
			.then(function (page) {
				page.property('viewportSize', viewport).then(function() {
					page.open(url)
						.then(function () {
							page.render(assets_dir + '/' + generateName());
							phInstance.exit();
							return res('success');
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
		.then(msg => res.json({msg}))
		.catch(msg => res.json({msg}))
})

// listen on port

app.listen(PORT, () => console.log('Bring it on'))