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

var req = {};
db.queryAll(req, () => {
    var class_name = 'success';
    var projects = req.results;
    var training = projects.map(p => ({
        success: (Number(p.mesCustomer) + Number(p.mesContent) + Number(p.mesBudget) + Number(p.mesSchedule)) >= minSuccess,
        projMethod: methodEnum[p.projMethod],
        orgSize: sizeEnum[p.orgSize],
        orgFlexibility: p.orgFlexibility,
        orgResources: p.orgResources,
        projDuration: p.projDuration,
        projEffort: p.projEffort,
        projRisk: p.projRisk,
        projQuality: p.projQuality,
        projReliability: p.projReliability,
        projExperience: p.projExperience,
        projLife : p.projLife
    }));

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

    buildTree(training, class_name, features);
});