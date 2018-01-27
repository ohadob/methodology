var db = require('./db');

var req = {};
db.queryAll(req, () => {
    var projects = req.results;
    var realProjects = projects.filter(x => x.projLife);

    for (proj of realProjects) {
        var newProj = Object.assign({}, proj, {name: 'missing', email: 'missing'});
        var keys = Object.keys(proj);
        for (key of keys) {
            var value = proj[key];
            if (value >= 1 && value <= 5) {
                newProj[key] = Number(value) + Number(Math.random() > 0.5 ? 1 : -1);
                newProj[key] = (newProj[key] === 0 || newProj[key] === 6) ? 3 : newProj[key];
            }
        }
        delete newProj._id;
        console.log(newProj);
        db.save(newProj);
    }
});