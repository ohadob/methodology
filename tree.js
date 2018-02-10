var DecisionTree = require('decision-tree');
var clone = require('clone');
var db = require('./db');

var methodEnum = {
    Waterfall: 1000,
    Hybrid: 2000,
    Agile: 3000,
    Scrum: 4000,
    Rapid: 5000,
    Prototype: 6000,
    Spiral: 7000,
    'Extreme Programming': 8000,
};

const methodNames = Object.keys(methodEnum);

var sizeEnum = {
    '<50': 1,
    '<100': 2,
    '<1000': 3,
    '1000+': 4
};

var mapProject = (p, successPercent) => ({
    success: (Number(p.mesCustomer)
        + Number(p.mesContent)
        + Number(p.mesBudget)
        + Number(p.mesSchedule)) >= (successPercent * 0.2),
    projMethod: methodEnum[p.projMethod],
    orgSize: p['Organization Size'] ? sizeEnum[p['Organization Size']] : sizeEnum[p.orgSize],
    orgFlexibility: p.orgFlexibility ? Number(p.orgFlexibility) : 3,
    orgResources: p.orgResources ? Number(p.orgResources) : 3,
    projDuration: p.projDuration ? Number(p.projDuration) : 3,
    projEffort: p.projEffort ? Number(p.projEffort) : 3,
    projRisk: p.projRisk ? Number(p.projRisk) : 3,
    projQuality: p.projQuality ? Number(p.projQuality) : 3,
    projReliability: p.projReliability ? Number(p.projReliability) : 3,
    projExperience: p.projExperience ? Number(p.projExperience) : 3,
    projLife : p.projLife ? Number(p.projLife) : 3
});

var class_name = 'success';
var features = 
    ["projMethod",
    "orgSize",
    "orgFlexibility",
    "projDuration",
    "projEffort"];

var dts = [];
var req = {};
let projects = null;

function buildTree(training_data, class_name, features) {
    var dt = new DecisionTree(training_data, class_name, features);
    console.log(dt.toJSON());
    return clone(dt, true);
}

function init() {
    console.log('initiating tree module...');
    db.queryAll(req, () => {
        projects = req.results;
    
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
    delete projectData.success;

    let methods = [];
    let results = [];
    for (let methodName of methodNames) {
        const projMethod = methodEnum[methodName];
        const project = Object.assign({} , projectData, { projMethod });
        methods.push({projMethod , project, methodName});
    }

    for (let successPercent = 100; successPercent >= 25; successPercent -= 5) {
        var training = projects.map(p => mapProject(p, successPercent));        
        const dt = buildTree(training, class_name, features);
        console.log('successPercent:' ,successPercent);

        for (let method of methods) {
            console.log('projMethod:', method.projMethod);
            if (dt.predict(method.project)) {
                results.push({ method: method.methodName, successPercent: Number(successPercent) });
                methods = methods.filter(x => x.projMethod != method.projMethod);
            }
        }

        // quit the loop if all methods were calculated
        if (methods.length === 0) {
            break;
        }
    }

    results = results.sort((a,b) => b.successPercent - a.successPercent);
    console.log();
    console.log('results: ', JSON.stringify(results));
    return results;
}

module.exports = { init, predict };