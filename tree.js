var DecisionTree = require('decision-tree');
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
    console.log();
    var dt = new DecisionTree(training_data, class_name, features);
    console.log(JSON.stringify(dt.toJSON()));
    return dt;
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
db.queryAll(req, () => {
    var projects = req.results;

    for (let i = 1; i <= 100; i++) {
        var dt = { successPercent: i };
        var training = projects.map(p => mapProject(p, i));        
        dt.tree = buildTree(training, class_name, features);

        dts.push(dt);
        console.log('successPercent: ', i);
    }
});

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
    const projectData = mapProject(data);
    const results = {};
    for (let projMethod = 1; projMethod <= 10; projMethod++) {
        const project = Object.assign({ projMethod }, projectData);

        for (let successPercent = 100; successPercent >= 1; successPercent--) {
            const dt = dts.find(x => x.successPercent === successPercent);
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
    return 
}

module.exports = { predict };