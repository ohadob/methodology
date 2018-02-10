const irisDataset = require('ml-dataset-iris');
const DTRegression = require('ml-cart').DecisionTreeRegression;
var db = require('./db');

/*
var trainingSet = irisDataset.getNumbers();
var predictions = irisDataset.getClasses().map(
    (elem) => irisDataset.getDistinctClasses().indexOf(elem)
);

console.log('a', JSON.stringify(trainingSet));
console.log('b', JSON.stringify(predictions));

*/

var methodEnum = {
    Waterfall: 1,
    Hybrid: 2,
    Agile: 3,
    Scrum: 4,
    Rapid: 5,
    Prototype: 6,
    Spiral: 7,
    'Extreme Programming': 8,
};

const methodNames = Object.keys(methodEnum);

var sizeEnum = {
    '<50': 1,
    '<100': 2,
    '<1000': 3,
    '1000+': 4
};

var mapProject = p => ({
    success: (Number(p.mesCustomer)
        + Number(p.mesContent)
        + Number(p.mesBudget)
        + Number(p.mesSchedule)) * 5,
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


var options = {
    gainFunction: 'gini',
    maxDepth: 10,
    minNumSamples: 1
};

var req = {};
var classifier = new DTRegression();

function init() {
    console.log('initiating tree module...');
    db.queryAll(req, () => {
        projects = req.results;
        const rows =[];
        const predictions = [];
        projects.map(mapProject).forEach(p => {
            rows.push([p.projMethod, p.orgSize, p.orgFlexibility, p.orgResources, p.projDuration,
                p.projEffort, p.projRisk, p.projQuality, p.projReliability,
                p.projExperience, p.projLife]);
            predictions.push(p.success);
        });

        console.log('learned: ', JSON.stringify(rows));
        console.log('predictions: ', JSON.stringify(predictions));
        classifier.train(rows, predictions);

        console.log('classifier:', classifier.toJSON());
    });
}

function predict(data) {
    const projectData = mapProject(data);
    delete projectData.success;

    let methods = [];
    let results = [];
    for (let methodName of methodNames) {
        const projMethod = methodEnum[methodName];
        const project = Object.assign({} , projectData, { projMethod });
        methods.push({projMethod , project, methodName});
    }

    for (let method of methods) {
        console.log('projMethod:', method.projMethod);
        const p = method.project;
        const successPercent = classifier
            .predict([[p.projMethod, p.orgSize, p.orgFlexibility, p.orgResources, p.projDuration,
                p.projEffort, p.projRisk, p.projQuality, p.projReliability,
                p.projExperience, p.projLife]]);


                console.log('predicting: ', JSON.stringify([[p.projMethod, p.orgSize, p.orgFlexibility, p.orgResources, p.projDuration,
                    p.projEffort, p.projRisk, p.projQuality, p.projReliability,
                    p.projExperience, p.projLife]]));


        console.log('successPercent', JSON.stringify(successPercent))
        results.push({ method: method.methodName, successPercent: successPercent[0] });
    }
    

    results = results.sort((a,b) => b.successPercent - a.successPercent);
    console.log();
    console.log('results: ', JSON.stringify(results));
    return results;
}

module.exports = { init, predict };