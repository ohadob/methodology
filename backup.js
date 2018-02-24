var db = require('./db');
var fs = require('fs');

fs.readFile('../data.txt', function (err, data) {
    if (err) throw err;
    console.log(data);


    var projects = JSON.parse(data);
    for (const proj of projects) {
        proj.orgSize = proj['Organization Size'];
        delete proj['Organization Size'];
        delete proj.projExperience;
        delete proj._id;

        db.save(proj);
    }

  });