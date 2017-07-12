var collection = 'projects';
var url = 'mongodb://ohadob:ohadob@ds155132.mlab.com:55132/ohadob';

var mongoClient = require('mongodb').MongoClient;

var insertDocument = function(db, doc) {
  db.collection(collection).insertOne(doc, function(err, result) {
    if (err)
    {
      console.log('failed inserting a document:', err.message);
    } else {
      console.log('inserted a document into the collection:', JSON.stringify(doc), JSON.stringify(result));
    }

    db.close();
  });
};

var save = function(data) {
  mongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('failed connecting to mongo:', err.message);
    } else {
      insertDocument(db, data);
    }
  });
};

var queryAllDocuments = function(db, req, next) {
  var results = [];
  var cursor = db.collection(collection).find( );
  cursor.each(function(err, doc) {
    if (err) {
      console.log('failed connecting to mongo:', err.message);
    } else {
      if (doc != null) {
        results.push(doc);
      } else {
        db.close();
        console.log('results:', results);

        req.results = results;
        next();
      }
    }
  });
};

var queryAll = function(req, next) {
  mongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('failed connecting to mongo:', err.message);
    } else {
      return queryAllDocuments(db, req, next);
    }
  });
};

module.exports = { queryAll: queryAll, save: save};

