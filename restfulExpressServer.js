let express = require('express');
let app = express();
let fs = require('fs');
let petsPath = './pets.json';

app.disable('x-powered-by');
let port = process.env.PORT || 6000;

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let morgan = require('morgan');
app.use(morgan('short'));

app.get('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if(err) {
      console.err(err);
      return res.sendStatus(500);
    }
      let pets = JSON.parse(data);
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
      let numberId = parseInt(id);
      let pet = JSON.parse(data)[numberId];

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
    if (err) {
      throw err;
      return res.sendStatus(500);
    }
    let pets = JSON.parse(data);

    if(!req.body){
      return res.sendStatus(404);
    }
    let nameBody = req.body.name;
    let ageBody = req.body.age;
    let kindBody = req.body.kind;

    let newPet = {};
    newPet.name = nameBody;
    newPet.age = ageBody;
    newPet.kind = kindBody;

    if(nameBody && ageBody && kindBody){
      pets.push(newPet);
      fs.writeFile('./pets.json', JSON.stringify(pets), function(err){
        res.set('Content-Type', 'application/json');
        res.status(200);
        res.send(newPet);
      })
    }
    else if( !nameBody || !ageBody || !kindBody){
      res.contentType("text/plain");
      res.status(400);
      res.send('Bad Request');
    }
 });
});

app.patch('/pets/:index',function(req, res){
  fs.readFile('./pets.json', 'utf8', function(err, data){
    console.log('I am here');
    if(err){
      console.error(err.stack);
    }
    let index  = req.params.index;
    let numberIndex = parseInt(index);
    let pets = JSON.parse(data);

    let name = req.body.name;
    let age = parseInt(req.body.age);
    let kind = req.body.kind;

    let pet = pets[index]
    if(name){
      pet.name = name;
    }
    if(age){
      pet.age = age;
    }
    if(kind){
      pet.kind = kind;
    }

    fs.writeFile('./pets.json', JSON.stringify(pets),function(err){
      if(err){
        throw err;
        process.exit(1);
      }
      res.set('Content-Type', 'application/json');
      res.status(200);
      res.send(pets[index]);
    })
  })
})



app.delete('/pets/:id', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, data){
    if (err) {
      throw err;
      return res.sendStatus(500);
    }

    let id = req.params.id;
    let numberId = parseInt(id);
    let pets = JSON.parse(data)

    if(Number.isNaN(id) || id < 0 || id >= pets.length){
      res.sendStatus(404);
    }
    let pet = pets.splice(id,1)[0];
    fs.writeFile(petsPath, JSON.stringify(pets), function(err){
      if(err){
        throw err;
        process.exit(1);
      }
      res.set('Content-Type', 'application/json');
      res.status(200);
      console.log('i am here');
      res.send(pet);
    });
  })
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
