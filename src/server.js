const express = require('express');
const phantom = require('phantom');
const uuidV4 = require('uuid/v4');

let app = express();
let PORT = 3000;
let initViewPort = {width: 640, height: 400};

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
							page.render(generateName());
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

app.get('/screenshot', (req, res) => {
	takePhoto(req.query.url)
		.then(msg => res.json({msg}))
		.catch(msg => res.json({msg}))
})

// listen on port

app.listen(PORT, () => console.log('Bring it on'))