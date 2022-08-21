const path = require('path');
console.log("--", __dirname)
require('dotenv').config({
  silent: true, path: path.join(__dirname, '.env'),
}); // Stores custom environmental variables
const app = require('/app')
// 
// const server = require('./app');

const PORT = process.env.BACK_END_PORT;

const listener = server.listen(PORT, function() {
  console.log(`Server running on port: ${PORT}`);
});

const close = () => {
  listener.close();
};

module.exports = {
  close: close,
};
