const fs = require('fs');
const path = require('path');
const protobuf = require('protocol-buffers');

const rpc = require('./lib');
const column = require('./data');

const PORT = 7777;

const PROTO_DIR = path.resolve(process.cwd(), './detail/proto/column.proto');

const {DetailRequest, DetailResponse} = protobuf(fs.readFileSync(PROTO_DIR, 'utf-8'));

const tcp_rpc = rpc(DetailResponse, DetailRequest);

const server = tcp_rpc.createServer((request, response) => {
    const {body: {column_id}} = request;
    console.log(`column_id: ${column_id}`);

    //...

    response.end({
        column: column[0],
        recommend_columns: [column[1], column[2], column[3], column[4]]
    });
});

server.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}!`);
});