const PouchDB = require('pouchdb');

const db = new PouchDB('http://joonasy.cloudant.com/rainbow6', {
  auth: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
});

function isSaved(id) {
  console.log(
    db.get(id, (err, found) => {
      if (err) {
        return err
      } else {
        result = 'found';
        myBrain(result);
      }
    })
  );
}

function myBrain(result) {
  if (result = '404') {
    return true;
  } else {
    return false; 
  }
}

function getDB() {
  db.query('savedPosts', {
    key: 'post',
    include_docs: true
  }).then((result) => {
    return 
  });
}

function saveToDB(id) {

}

module.exports = {
  isSaved,
  saveToDB,
  myBrain
};