var regressionTree = require( 'wink-regression-tree' );

var db = require('./db');

var methodEnum = {
    Waterfall: 'Waterfall',
    Hybrid: 'Hybrid',
    Agile: 'Agile',
    Scrum: 'Scrum',
    Rapid: 'Rapid',
    Prototype: 'Prototype',
    Spiral: 'Spiral',
    'Extreme Programming': 'EP',
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
    orgSize: sizeEnum[p['Organization Size']],
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

    // Specify columns of the training data.
var columns = [
    { name: 'projMethod', categorical: true },
    { name: 'orgSize', categorical: false },
    { name: 'orgFlexibility', categorical: false},
    { name: 'orgResources', categorical: false },
    { name: 'projDuration', categorical: false },
    { name: 'projEffort', categorical: false },
    { name: 'projRisk', categorical: false },
    { name: 'projQuality', categorical: false },
    { name: 'projReliability', categorical: false },
    { name: 'projExperience', categorical: false },
    { name: 'projLife', categorical: false }
  ];

  // Specify configuration for learning.
  var treeParams = {
    minPercentVarianceReduction: 0.5,
    minLeafNodeItems: 10,
    minSplitCandidateItems: 30,
    minAvgChildrenItems: 2
  };

var req = {};
var rt = regressionTree();
rt.defineConfig( columns, treeParams );

const rows = [];
function init() {
    console.log('initiating tree module...');
    db.queryAll(req, () => {
        projects = req.results;
        projects.map(mapProject).forEach(p => {
            const row = [];
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i];
                row.push(p[column.name]);
            }
            row.push(p['success']);
            console.log('ingesting project: ', JSON.stringify(row));
            rows.push(row);
        });

        console.log('res: ', JSON.stringify(rows));
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
        const successPercent = rt.predict(method.project);
        results.push({ method: method.methodName, successPercent });
    }
    

    results = results.sort((a,b) => b.successPercent - a.successPercent);
    console.log();
    console.log('results: ', JSON.stringify(results));
    return results;
}

module.exports = { init, predict };