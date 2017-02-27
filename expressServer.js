var express = require('express');
//console.log(express);
var app = express();
// console.log('this is app')
// console.log(app);
var fs = require('fs');
var petsPath = './pets.json';
var port = 7000;
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
      console.log(typeof data);
      if (err) {
        throw err;
        return res.sendStatus(500);
      }

      let id = req.params.id;
      var numberId = parseInt(id);
      var pet = JSON.parse(data)[numberId];

      //console.log(JSON.parse(data));
      if(pet){
        //res.set('Content-Type', 'application/json');
        res.contentType('application/json');
        res.status(200);
        res.json(pet);
      }
      else if( numberId < 0 || numberId >= JSON.parse(data).length || Number.isNaN(numberId)){

      res.status(404);
      res.contentType("text/plain");
      res.send('Not Found');
      //res.sendStatus(404);
    }
  });
});

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, data){ //petsPath is a pets.JSON
    //console.log(data);
    if (err) {
      throw err;
      return res.sendStatus(500);
    }
    var pets = JSON.parse(data);
    //console.log(pets);
    //console.log(req.body);  //up until this line my code isnt working.
    if(!req.body){
      return res.sendStatus(404);
    }
    var nameBody = req.body.name;
    var ageBody = req.body.age;
    var kindBody = req.body.kind;

    var newPet = {};
    newPet.name = nameBody;
    newPet.age = ageBody;
    newPet.kind = kindBody;
    // console.log(newPet);

    if(nameBody && ageBody && kindBody){
      pets.push(newPet);
      fs.writeFile('./pets.json', JSON.stringify(pets), function(err){
        //res.set('Content-Type', 'application/json');
        // console.log(' i am here');
        if(err){
          
          throw err;
        }
        console.log();
        res.status(200);
        res.json(newPet);
      })
    }
    else if( !nameBody || !ageBody || !kindBody){
      res.contentType("text/plain");
      res.status(400);
      res.send('Not Found');
    }

 });
});

app.use(function (req, res,next) {
  res.contentType('text/plain');
  res.status(404);
  res.send('Not Found');
  next();
})

app.listen(port, function(){
  console.log('hello word');
});

module.exports = app;
