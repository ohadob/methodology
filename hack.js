var db = require('./db');

const p = { name: 'missing',
email: 'missing',
'Organization Size': '<50',
orgFlexibility: '3',
projDuration: '8',
projEffort: '5',
projMethod: 'Rapid',
projMethodOther: '',
mesSchedule: '1',
mesBudget: '1',
mesContent: '1',
mesCustomer: '4' };

db.save(p);

const a = ["projMethod",
    "orgSize",
    "orgFlexibility",
    "projDuration",
    "projEffort"];


const results =  [{"method":"Extreme Programming","successPercent":90},
    {"method":"Scrum","successPercent":70},
    {"method":"Waterfall","successPercent":65},
    {"method":"Hybrid","successPercent":65},
    {"method":"Agile","successPercent":65},
    {"method":"Spiral","successPercent":55},
    {"method":"Prototype","successPercent":50},
    {"method":"Rapid","successPercent":30}];