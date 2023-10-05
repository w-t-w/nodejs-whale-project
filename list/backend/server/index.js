const path = require('path');
const fs = require('fs');
const protobuf = require('protocol-buffers');

const columns = require('./data');
const rpc = require('./lib');

const sort_config = {
    1: 'id',
    2: 'sub_count',
    3: 'column_price'
};

const default_filter_enum = 0;

const PORT = 7777;

const PROTO_DIR = path.resolve(process.cwd(), './list/backend/proto/column.proto');

const {ListRequest, ListResponse} = protobuf(fs.readFileSync(PROTO_DIR, 'utf-8'));

const tcp_rpc = rpc(ListResponse, ListRequest);

const server = tcp_rpc.createServer((request, response) => {
    const {body: {sort, filter}} = request;
    console.log(`sort: ${sort}, filter: ${filter}`);

    //...

    response.end({
        columns: columns.sort((a, b) => {
            const sort_result = sort_config[sort];
            return a[sort_result] - b[sort_result];
        }).filter(item => default_filter_enum === filter ? item : filter === item.type)
    });
});

server.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}!`);
});