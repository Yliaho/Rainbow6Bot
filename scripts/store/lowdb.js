const low = require('lowdb');

const db = low('./scripts/store/db.json');

db.defaults({
    submissions: []
})
.write();

function isSaved(postID) {
  const dbQuery = db.get('submissions').value();
  function queryResults() {
    let result;
    for (let i in dbQuery) {
      if (dbQuery[i].id == postID) {
        result = true;
        break;
      } else {
        result = false; 
      }
    }
    return result;
  }  
  return queryResults();  
}

function saveToDB(post) {
  db.get('submissions')
    .push(post)
    .write();
  
  console.log(`...${post.id} saved to database`);
}

module.exports = {
  isSaved,
  saveToDB
};