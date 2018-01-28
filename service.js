var db = require('./db');

var req = {};
db.queryAll(req, () => {
    var projects = req.results;
    var realProjects = projects.filter(x => x.projLife);

    var count = 0;
    for (proj of realProjects) {
        p = Object.assign({}, proj);
        if (!p.mesSchedule) {
            p.mesSchedule = 4;
            delete p._id;
            console.log(p);
            db.delete(proj);
            db.save(p);
            count += 1;
        }
    }

    console.log();
    console.log(count);
});