
const server = require('./src/app.js');
const { connection } = require('./src/db.js');

// Syncing all the models at once.
connection.sync({ force: false }).then(() => {
  server.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});
