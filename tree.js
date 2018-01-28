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

var mapProject = p => ({
    success: (Number(p.mesCustomer) + Number(p.mesContent) + Number(p.mesBudget) + Number(p.mesSchedule)) >= minSuccess,
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

var dt = null;
var req = {};
db.queryAll(req, () => {
    var class_name = 'success';
    var projects = req.results;
    var training = projects.map(mapProject);

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

    console.log('training: ', JSON.stringify(training));
    console.log('class_name: ', class_name);
    console.log('features: ', JSON.stringify(features));

    dt = buildTree(training, class_name, features);


    var mulp = dt.predict({ 'Organization Size': 2,
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
    projMethodOther: '' })

    console.log('mulp: ', mulp);
});

function predict(data) {
    const project = mapProject(data);
    return dt.predict(project);
}

module.exports = { predict };