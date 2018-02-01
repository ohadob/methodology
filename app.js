var express = require('express');
var path = require('path');
var db = require('./db');
var tree = require('./tree');
var bodyParser = require('body-parser');
var swal = require('sweetalert');

const app = express();
const port = process.env.PORT || 8181;

app.use(bodyParser());

tree.init();

function parseResults(predictResults) {
  let text = '';
  let i = 1;
  for (const predictResult of predictResults) {
    text += `${i}. ${predictResult.method}: ${predictResult.successPercent}%\n`;
    i += 1;
  }

  text = text.slice(0, -1);
  console.log(text);
  const swal = {
    title: "Results",
    text,
    icon: "info"
  };
  return swal;
}

app.get('/test', function (req, res) { res.send('1') });

app.post('/save', function (req, res) {
  console.log('doc: ', req.body);
  db.save(req.body);
  res.send(true);
});

app.post('/submit', function (req, res) {
  console.log('doc: ', req.body);
  swal("Hello world!");
  const result = tree.predict(req.body);
  const prettyRes = parseResults(result);
  res.send(prettyRes);
});

var sendResults = function (req, res, next) {
  res.send(req.results);c

  return next();
}

app.get('/query', function (req, res, next) {
  return db.queryAll(req, next);
}, sendResults);

app.use('/form', express.static(path.join(__dirname, 'form.html')))
app.use('/form.js', express.static(path.join(__dirname, 'form.js')))
app.use('/form.css', express.static(path.join(__dirname, 'form.css')))

app.use('/predict', express.static(path.join(__dirname, 'predict.html')))
app.use('/predict.js', express.static(path.join(__dirname, 'predict.js')))
app.use('/predict.css', express.static(path.join(__dirname, 'predict.css')))


var server = app.listen(port, function() {
    console.log('listening on port', server.address().port);
});

