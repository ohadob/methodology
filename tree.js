var DecisionTree = require('decision-tree');
var clone = require('clone');
var db = require('./db');

const minSuccess = 13;

var methodEnum = {
    Waterfall: 1,
    Prototype: 2,
    Agile: 3,
    Scrum: 4,
    Hybrid: 5,
    Rapid: 6,
    Spiral: 7,
    'Extreme Programming': 8,
    'Feature Driven':9,
    Lean: 10
};

const methodNames = Object.keys(methodEnum);

var sizeEnum = {
    '<50': 1,
    '<100': 2,
    '<1000': 3,
    '1000+': 4
};

function buildTree(training_data, class_name, features) {
    var dt = new DecisionTree(training_data, class_name, features);
    console.log(dt.toJSON());
    return clone(dt, true);
}

var mapProject = (p, successPercent) => ({
    success: (Number(p.mesCustomer)
        + Number(p.mesContent)
        + Number(p.mesBudget)
        + Number(p.mesSchedule)) >= (successPercent * 0.2),
    projMethod: methodEnum[p.projMethod],
    orgSize: sizeEnum[p.orgSize],
    orgFlexibility: Number(p.orgFlexibility),
    orgResources: Number(p.orgResources),
    projDuration: Number(p.projDuration),
    projEffort: Number(p.projEffort),
    projRisk: Number(p.projRisk),
    projQuality: Number(p.projQuality),
    projReliability: Number(p.projReliability),
    projExperience: Number(p.projExperience),
    projLife : Number(p.projLife)
});

var class_name = 'success';
var features = 
    ["projMethod",
    "orgSize",
    "orgFlexibility",
    "orgResources",
    "projDuration",
    "projEffort",
    "projRisk",
    "projQuality",
    "projReliability",
    "projExperience",
    "projLife"];

var dts = [];
var req = {};

function init() {
    console.log('initiating tree module...');
    db.queryAll(req, () => {
        var projects = req.results;
    
        for (let i = 1; i <= 100; i++) {
            var dt = { successPercent: i };
            var training = projects.map(p => mapProject(p, i));        
            const tree = buildTree(training, class_name, features);
            dt.tree = tree;
    
            dts.push(dt);
            console.log('successPercent: ', i);
            const dt1 = dts.find(x => x.successPercent = 1);
            console.log('dt1: ', dt1.successPercent ,dt1.tree.toJSON());
        }
    });
}

function predictTest() {
    var mulp = dts.find(x => x.successPercent = 80).predict({
        'Organization Size': 2,
        orgFlexibility: 5,
        orgResources: 5,
        projDuration: 12,
        projEffort: 10,
        projRisk: 1,
        projQuality: 5,
        projReliability: 4,
        projExperience: 5,
        projLife: 2,
        projMethod: 4,
        projMethodOther: ''
    });

    console.log('predict: ', predict);
}

function predict80(data) {
    const project = mapProject(data);
    return dts.find(x => x.successPercent = 80).predict(project);
}

function predict(data) {
    const projectData = mapProject(data, 100);
    const results = {};
    for (let projMethod = 1; projMethod <= 10; projMethod++) {
        const project = Object.assign({} , projectData, { projMethod });
        delete project.success;

        for (let successPercent = 100; successPercent >= 1; successPercent--) {
            console.log('dts: ',JSON.stringify(dts));
            const dt = dts.find(x => x.successPercent === successPercent).tree;
            console.log('projMethod:', projMethod);
            console.log('project:', JSON.stringify(project));
            console.log('successPercent:' ,successPercent);
            console.log('tree:', JSON.stringify(dt.toJSON()));
            console.log('predict: ', dt.predict(project));
            if (dt.predict(project)) {
                const methodName = methodNames
                    .find(name => methodEnum[name] === projMethod);

                results[methodName] = successPercent;
                console.log('method: ', methodName);
                console.log('successPercent: ', successPercent);
                break;
            } 
        }
    }

    console.log();
    console.log();
    console.log('results: ', JSON.stringify(results));
    return results;
}

module.exports = { init, predict };