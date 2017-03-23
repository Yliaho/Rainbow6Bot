const low = require('lowdb');

const db = low('./scripts/store/db.json');

db.defaults({
    submissions: []
})
.write();

function isSaved(Postid) {
  const dbQuery = db.get('submissions').value();
  function queryResults() {
    for (let i in dbQuery) {
      if (dbQuery[i].id == Postid) {
        return true;
      } else if (i > dbQuery.length) {
        return false;
      } else {
        return []; //<-- db is empty if/when this gets returned... probably, right?
      }
    }

  }  
  return queryResults();  
}

function saveToDB(post) {
  db.get('submissions')
  .push(post)
    .write();
  console.log(`...${post.id} saved to database`)
}

module.exports = {
  isSaved,
  saveToDB
};