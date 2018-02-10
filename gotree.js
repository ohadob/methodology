const request = require('request');

const address = 'https://go-tree-method-o.herokuapp.com';

function buildTree(training) {
    console.log('training:', training);
    request.post({
        headers: {'content-type' : 'application/json'},
        url:    address + '/updateTree',
        body: JSON.stringify(training)
      }, function(error, response, body){
        console.log(body);
      });
}

function predict(data) {
    console.log('data:', data);
    return new Promise(function(resolve, reject) {
      request.post({
        headers: {'content-type' : 'application/json'},
        url:    address + '/predicate',
        body: JSON.stringify(data)
      }, function(error, response, body) {
        console.log(body);
        resolve(body);
      });
    });
}

module.exports = { buildTree, predict };