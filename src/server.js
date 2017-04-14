const express = require('express');

let app = express();
let PORT = 3000;

app.get('/screenshot', (req, res) => {
	res.json({
		message: 'hello world'
	})
})

// listen on port

app.listen(PORT, () => console.log('Bring it on'))