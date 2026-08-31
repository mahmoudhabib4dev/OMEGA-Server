const { createServer } = require('node:http');
require('dotenv').config();

const port = process.env.PORT;
const host = process.env.HOST;

const server = createServer((req, res) => {

});

server.listen(port, host, () => {
    console.log(`Server is running on  http://${host}/${port}`);

});