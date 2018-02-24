var db = require('./db');

const p = { name: 'missing',
email: 'missing',
'Organization Size': '<100',
orgFlexibility: '1',
projDuration: '12',
projEffort: '4',
orgResources: '4',
projRisk: '1',
projQuality: '2',
projReliability: '3',
projExperience:  '15',
projLife : '1',
projMethod: 'Rapid',
projMethodOther: '',
mesSchedule: '5',
mesBudget: '3',
mesContent: '5',
mesCustomer: '5' };

db.save(p);



const results =  [{"method":"Extreme Programming","successPercent":90},
    {"method":"Scrum","successPercent":70},
    {"method":"Waterfall","successPercent":65},
    {"method":"Hybrid","successPercent":65},
    {"method":"Agile","successPercent":65},
    {"method":"Spiral","successPercent":55},
    {"method":"Prototype","successPercent":50},
    {"method":"Rapid","successPercent":30}];