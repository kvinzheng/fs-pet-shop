'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = './pets.json';
var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];
var indexC1 = process.argv[4];


if (cmd === 'read') {
  var indexR = process.argv[3];
  // console.log('indexR', indexR);
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
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
    }


    //var result = pets[i]
    //var pet = process.argv[3];
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
      //console.log(pets);
    });
  });
} else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
