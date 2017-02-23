#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = './pets.json';
var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

if (cmd === 'read') {
  var indexR = process.argv[3];
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
      process.exit(1);
    }

    if (!indexR) {
      var pets = JSON.parse(data);
      console.log(pets);
    } else {
      var pets = JSON.parse(data);

      if (pets[indexR] === undefined) {
        console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      } else {
        var pet = JSON.parse(data)[indexR];
        console.log(pet);
      }
    }
  });
} else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    var age = process.argv[3];
    var kind = process.argv[4];
    var name = process.argv[5];

    if (readErr) {
      throw readErr;
      process.exit(1);
    }
    if (!age || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    var pet = {};
    pet['age'] = parseInt(age,10);
    pet['kind'] = kind;
    pet['name'] = name;
    var pets = JSON.parse(data);
    pets.push(pet);
    console.log(pet);
    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
    });
  });
}else if(cmd === 'update'){
  fs.readFile(petsPath, 'utf8', function(readErr,data){
    if(readErr){
      throw readErr;
    }
    var index = process.argv[3];
    var age = process.argv[4];
    var kind = process.argv[5];
    var name = process.argv[6];

    if (!age || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }
    var pets = JSON.parse(data);
    var pet = {};
    pet['age'] = parseInt(age,10);
    pet['kind'] = kind;
    pet['name'] = name;

    var update = pets.splice(index,1,pet);
    console.log(pet);

    var petsJSON = JSON.stringify(pets);
    fs.writeFile(petsPath, petsJSON, function(writeErr){
      if(writeErr){
        throw writeErr;
      }
    });
  });
}
else if(cmd === 'destroy'){
  fs.readFile(petsPath, 'utf8', function(readErr, data){
    if(readErr){
      throw readErr;
      process.exit(1);
    }
    var index = process.argv[3];

    if(!index){
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    var pets = JSON.parse(data);
    var destroy = pets.splice(index,1)[0];
    console.log(destroy);

    var petsJSON = JSON.stringify(pets);
    fs.writeFile(petsPath, petsJSON, function(writeErr){
      if(writeErr){
        throw writeErr;
        process.exit(1);
      }
    });
  })
}
  else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
