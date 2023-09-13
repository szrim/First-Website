const pool = require('./index');

function getAllGroceries() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM groceries', (err, results) => {
      if (err) {
        console.error('Error fetching MySQL data:', err.message);
        return reject(err);
      }
      //const [ rows ] = results;
      resolve(results);
    });
  });

};

module.exports = getAllGroceries



