'use strict';

const express = require('express')
const mongo = require('mongodb')
const path = require('path')
const api = require("./api.js")

var app = express()

mongo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener', function(err, db) {

  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('Successfully connected to MongoDB on port 27017.');
  }
  
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, './index.html'))
  })
  
  api(app, db)
  
})


app.set('port', (process.env.PORT || 8080))
const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
})
