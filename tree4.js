var regressionTree = require( 'wink-regression-tree' );

var db = require('./db');
var gotree = require('./gotree');

var methodEnum = {
    Waterfall: 'Waterfall',
    Agile: 'Agile'
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
    projMethod: p.projMethod,
    orgSize: p.orgSize ? sizeEnum[p.orgSize] : 3,
    orgFlexibility: p.orgFlexibility ? Number(p.orgFlexibility) : 3,
    orgResources: p.orgResources ? Number(p.orgResources) : 3,
    projDuration: p.projDuration ? Number(p.projDuration) : 11,
    projRisk: p.projRisk ? Number(p.projRisk) : 3,
    projQuality: p.projQuality ? Number(p.projQuality) : 3,
    projReliability: p.projReliability ? Number(p.projReliability) : 3,
    projEffort: p.projEffort ? Number(p.projEffort) : 9,
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
    { name: 'projLife', categorical: false }
  ];

function toArray(p, addSuccess = false) {
    const row = [];
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        row.push(p[column.name].toString());
    }
    if (p['success']) {
        row.push(p['success'].toString());
    } else if (addSuccess) {
        row.push('75');
    }

    return row;
}

var req = {};
const rows = [];

function init() {
    console.log('initiating tree module...');
    db.queryAll(req, () => {
        projects = req.results;
        const rows = projects.map(mapProject).map(toArray, true);
        
        console.log('res: ', JSON.stringify(rows));


        const l = rows[0].length;
        console.log('a  ', JSON.stringify(rows.filter(r => r.length != l)));

        const treeModel = gotree.buildTree(rows);
        console.log();
        console.log(treeModel);
    });
}

function validator(data) {
    let waterfallP = 70;
    let agileP = 75;

    if (data.projEffort && Number(data.projEffort) < 10000) {
        waterfallP = 80;
        agileP = 70;
    }
    if (data.projEffort && Number(data.projEffort) < 11) {
        waterfallP = 75;
        agileP = 75;
    }
    if (data.projEffort && Number(data.projEffort) < 6) {
        waterfallP = 65;
        agileP = 80;
    }


    if (data.orgSize === '<50') {
        waterfallP = 45;
        agileP = 65;
    }
    if (data.orgSize === '<100') {
        waterfallP = 60;
        agileP = 75;
    }
    if (data.orgSize === '<1000') {
        waterfallP = 80;
        agileP = 80;
    }
    if (data.orgSize === '1000+') {
        waterfallP = 85;
        agileP = 75;
    }

    return [{ method: 'Waterfall', successPercent: waterfallP },
        { method: 'Agile', successPercent: agileP }];
}

async function predict(data) {
    if (!data.orgFlexibility && !data.orgResources && !data.projQuality) {
        return validator(data);
    }

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
        const projectArray = toArray(method.project);
        console.log('projectArray:', projectArray);
        const predictRes = await gotree.predict(projectArray);
        const successPercent = Number(predictRes.substr(1,2));
        console.log(predictRes.substr(1,2));
        results.push({ method: method.methodName, successPercent });
    }

    results = results.sort((a,b) => b.successPercent - a.successPercent);
    console.log();
    console.log('results: ', JSON.stringify(results));
    return results;
}

module.exports = { init, predict };