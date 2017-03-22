const PouchDB = require('pouchdb');

const db = new PouchDB('http://localhost:5984/rainbow6', {
  auth: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
});

const tempHot = [];

function saveHot(object, numberID) {
  let document = {
    _id: numberID,
    type: 'hot',
    title: object.title,
    thumb: object.thumbnail || undefined,
    subreddit: object.subreddit.display_name
  };
  db.get(numberID).then(doc => {
    document._rev = doc._rev;
    return db.put(document).catch(err => { console.error(err.name); });
  }).catch((err) => {
    switch (err.name) {
      case 'conflict':
        console.log('already in db (remember _rev)');
        break;
      case 'not_found':
        db.put(document).catch(err => {
          console.log(err.name);
        });
        break;
      default:
        console.log(err.name);
    }
  });
}

function listHot(limit) {
  db.query('currentHot', {
    key: 'hot',
    limit: limit || 10,
    include_docs: true
  }).then((e) => { 
    console.log(e);
  }).catch(err => {
    console.log(err);
  });
}

module.exports = {
  saveHot,
  listHot
};