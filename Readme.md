# screenshot-webpage-server
> Screenshot webpages using phantomJS

##### NOTE : This api need node version >= 7

This Api uses

* NodeJS ( version >= 7 )
* Nodemon
* PhantomJS ( For capturing webpage images )
* Express ( For creating endpoint )
* Pm2 ( For running application in production )

### Get Started
Fire up your terminal
```sh
git clone https://github.com/manojsinghnegiwd/screenshot-webpage-server.git
cd screenshot-webpage-server
npm install
npm run dev
```
Your server is started on port 3000 in your browser go to
```
http://localhost:3000/screenshot?url=http://www.google.com
```
Put any url in place of http://www.google.com. You will get image as the response of the request. Checkout live version here http://www.manojsinghnegi.com/screenshot?url=http://www.manojsinghnegi.com

# Query Params
 * `url` : Address of the webpage to take screenshot of
 * `width` : viewport width ( default is `1360` )
 * `height` : viewport height ( default is `768` )
 * `format` : default is `raw` can be change to `base64`

# Response
You will get an image as the reponse of the request. Images will be saved in assets folder for future use and serverd at http://localhost:(port)/shots.

# Scripts
 * `npm run dev` : start the server on port 3000
 * `npm run prod` : start the server on port 8080
 * `npm run stop` : stop the server when on production mode

# Happy Coding

### About Me

 * [My website](http://manojsinghnegi.com) (manojsinghnegi.com)
 * [Github](http://github.com/manojsinghnegiwd) (@manojsinghnegiwd)
 * [Twitter](http://twitter.com/manojnegiwd) (@manojnegiwd)