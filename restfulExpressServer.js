let express = require('express');
let app = express();
let fs = require('fs');
let path = require('path');
let petsPath = path.join(__dirname,'pets.json');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = process.env.PORT || 6004;

app.disable('x-powered-by');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

app.use(morgan('dev'));


let basicAuth = require('basic-auth');

function auth(req, res, next){
  function unauthorized(res) {
    //  res.set('Content-Type', 'text/plain')
    res.set('WWW-Authenticate', 'Basic realm="Required"');
    res.send(401);
  };

  let user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'admin' && user.pass === 'meowmix') {
    return next();
  } else {
    return unauthorized(res);
  };
};

app.use(auth);

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    let pets = JSON.parse(data);
    res.status(200)
    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
       console.error(err.stack);
      return res.sendStatus(500);
    }

    let id = req.params.id;
    let numberId = parseInt(id);
    let pet = JSON.parse(data)[numberId];

    if(pet){
      res.set('Content-Type', 'application/json');
      res.contentType('application/json');
      res.status(200);
      res.send(pet);
    }
    else if( numberId < 0 || numberId >= JSON.parse(data).length || Number.isNaN(numberId)){
      res.status(404);
      res.contentType("text/plain");
      res.send('Not Found');
    }
  });
});

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', (err, data) => { //petsPath is a pets.JSON
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let pets = JSON.parse(data);

    let nameBody = req.body.name;
    let ageBody = req.body.age;
    let kindBody = req.body.kind;

    let newPet = {};
    newPet.name = nameBody;
    newPet.age = ageBody;
    newPet.kind = kindBody;

    if(nameBody && ageBody && kindBody){
      pets.push(newPet);
      fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
        if(err){
          console.error(err.stack);
          return res.sendStatus(500);
        }
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

app.patch('/pets/:index', function(req, res){
  fs.readFile(petsPath, 'utf8', (err, data) => {
    // console.log('I am here');
    if(err){
      console.error(err.stack);
      res.sendStatus(500);
    }
    let index  = req.params.index;
    let numberIndex = parseInt(index);
    let pets = JSON.parse(data);

    let name = req.body.name;
    let age = parseInt(req.body.age);
    let kind = req.body.kind;

    if(!name && !age && !kind){
      sendstatus(400);
    }
    else{
      let pet = pets[index]
      newPet = {
        name : name || pet.name,
        age  : age  || pet.age,
        kind : kind || pet.kind,
      }
      pets[index] = newPet;
    }

    fs.writeFile(petsPath, JSON.stringify(pets),(err) => {
      if(err){
        console.error(err.stack);
        return res.sendStatus(500);
        process.exit(1);
      }
      res.set('Content-Type', 'application/json');
      res.status(200);
      res.send(newPet);
    })
  })
})

app.delete('/pets/:id',(req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
       console.error(err.stack);
       return res.sendStatus(500);
    }

    let id = req.params.id;
    let numberId = parseInt(id);
    let pets = JSON.parse(data)

    if(Number.isNaN(id) || id < 0 || id >= pets.length){
      res.sendStatus(404);
    }
    let pet = pets.splice(id,1)[0];
    fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
      if(err){
        console.error(err.stack);
        res.sendStatus(500);
        process.exit(1);
      }
      res.set('Content-Type', 'application/json');
      res.status(200);
      // console.log('i am here');
      res.send(pet);
    });
  })
});

app.use((req, res,next) => {
  res.contentType('text/plain');
  res.status(404);
  res.send('Not Found');
  next();
})

app.listen(port, () => {
  console.log('listening on port',port);
});

module.exports = app;
