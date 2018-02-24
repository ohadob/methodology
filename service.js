var db = require('./db');
var fs = require('fs');

var req = {};
db.queryAll(req, () => {
    var req2 = {};
    var projects = req.results;
    for (const proj of projects) {
        proj.orgSize = proj['Organization Size'];
        delete proj['Organization Size'];
        delete proj.projEffort;

        db.delete(proj);
        db.save(proj);
    }


});