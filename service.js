var db = require('./db');

var req = {};
db.queryAll(req, () => {
    
    var req2 = {};
    db.queryAll(req2, () => {
        var projects = req.results;
        var projects2 = req2.results;
        var allProjects = projects.concat(projects2);
        for (proj of allProjects) {
            db.save(proj, 'projects3');
        }
    }, 'projects2');

}, 'projects');