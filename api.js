'use strict';

module.exports = (app, db) => {
    
    const validUrl = require('valid-url')
    const bodyParser = require('body-parser')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    
    const shortenForm = (req, res) => {
        req.params.url = req.body.text
        shorten(req, res)
    }
    
    const checkUrl = (req, res) => {
        let url  = req.params.url + req.params['0']
        let collection = db.collection('sites')
        collection.find({
            "longUrl": url
        }).toArray((err, result) => {
            if(err) throw err
            
            if(result[0]) {
                let succesObj = {
                    "longUrl": url,
                    "shortUrl": result[0].shortUrl
                }
                res.send(succesObj)
            } else {
                shorten(req, res, url)
            }
        })
    }
    
    const shorten = (req, res, url) => {
        let shortUrl = 'https://short-url.herokuapp.com/'
        
        for(let i = 0; i < 4; i++){
            shortUrl += Math.floor((Math.random() * 10))
        }
        
        console.log(shortUrl)
        if (validUrl.isUri(url)){
            let obj = {
                "longUrl": url,
                "shortUrl": shortUrl 
            }
            let collection = db.collection('sites')
            collection.save(obj, (err, result) => {
                if(err) throw err
                
                let succesObj = {
                    "longUrl": obj.longUrl,
                    "shortUrl": obj.shortUrl
                }
                res.send(succesObj)
            })
        } else {
            let errorObj = {
                "error": "Wrong url format, make sure you have a valid protocol and real site."
            }
            res.send(errorObj)
        }
    }
    
    const show = (req, res) => {
        let collection = db.collection('sites')
        collection.find({}).toArray((err, result) => {
            if(err) throw err
            res.send(JSON.stringify(result))
        })
    }
    
    const getLongUrl = (req, res) => {
        let url  = 'https://short-url.herokuapp.com/' + req.params.url
        let collection = db.collection('sites')
        collection.find({
            "shortUrl": url
        }).toArray((err, result) => {
            if(err) throw err
            
            if(result[0]) {
                console.log('Redirecting to: ', result[0].longUrl)
                res.redirect(result[0].longUrl)
            } else {
                console.log('This url is not on the database.')
                let errorObj = {
                    "error": "This url is not on the database."
                }
                res.send(errorObj)
            }
        })
    }
    
    app.get('/:url', getLongUrl)
    
    app.get('/show/urls', show)
    
    app.get('/new/:url*', checkUrl)
    
    app.post('/new', shortenForm)
    
}