var express = require('express');
var app = express();
var fs = require('fs');
var petsPath = './pets.json';
var port = 8000;

app.get('/pets', function(req, res){
  //res.send('I made an Express app!');
  //res.status(200);
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      console.err(err);
      // throw err;
      return res.sendStatus(500);
    //  return req.status(500);
    }
      var pets = JSON.parse(data);
      res.status(200).send(pets);
    });
});

app.get('/pets/:id', function(req, res){
    fs.readFile(petsPath, 'utf8', function(err, data) {
      if (err) {
        throw err;
        return res.sendStatus(500);
        //return res.status(500);
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

      //res.status(404);
      //res.contentType("text/plain");
      //res.send('Not Found');
      res.sendStatus(404);

      // app.get('/pets/:index', (req, res) => {
      // fs.readFile(petsDB, 'utf8', (readErr, petsJSON) => {
      //   if(readErr) {
      //     console.error(readErr.stack);
      //     return res.sendStatus(500);
      //   }
      //   let index = Number(req.params.index);
      //   let pets = JSON.parse(petsJSON);
      //   if(index < 0 || index >= pets.length || Number.isNaN(index)) {
      //     return res.sendStatus(404);
      //   }
      //   res.set('Content-Type', 'application/json');
      //   res.send(pets[index]);
      // });
      // });
    }
  });
});


app.listen(port, function(){
  console.log('hello word');
});

module.exports = app;
