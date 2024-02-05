const {port} = require("./config");
const http = require("http");
const app = require("./app");

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server  is up and running on port : ${port}`);
});

module.exports = server;
