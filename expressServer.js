var express = require('express');
var app = express();
var fs = require('fs');
var petsPath = './pets.json';
var port = 8000;

app.get('/pets', function(req, res){
  //res.send('I made an Express app!');
  res.status(200);
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
      var pets = JSON.parse(data);
      res.send(pets);
    });
});

app.get('/pets/:id', function(req, res){

    fs.readFile(petsPath, 'utf8', function(err, data) {
      if (err) {
        throw err;
      }

      let id = req.params.id;
      var numberId = parseInt(id);
      var pet = JSON.parse(data)[numberId];

      if(pet){
        res.send(pet)
        res.status(200);

      }
      else{
      res.sendStatus(404);
      //res.contentType("text/plain");
      //res.send('Not Found');

    }
  });
});




app.listen(port, function(){
  console.log('hello word');
});

module.exports =app;
