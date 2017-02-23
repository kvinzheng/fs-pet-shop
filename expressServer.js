var express = require('express');
var app = express();
var fs = require('fs');
var petsPath = './pets.json';
var port = 8000;

app.get('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if(err) {
      console.err(err);
      return res.sendStatus(500);
    }
      var pets = JSON.parse(data);
      res.send(pets);
      res.status(200)
    });
});

app.get('/pets/:id', function(req, res){
    fs.readFile(petsPath, 'utf8', function(err, data) {
      if (err) {
        throw err;
        return res.sendStatus(500);
      }
      let id = req.params.id;
      var numberId = parseInt(id);
      var pet = JSON.parse(data)[numberId];

      if(pet){
        //res.set('Content-Type', 'application/json');
        res.contentType('application/json');
        res.status(200);
        res.send(pet);
      }
      else if( numberId < 0 || numberId >= JSON.parse(data).length || Number.isNaN(numberId)){

      res.status(404);
      res.contentType("text/plain");
      res.send('Not Found');
      //res.sendStatus(404);
    }
  });
});


app.listen(port, function(){
  console.log('hello word');
});

module.exports = app;
