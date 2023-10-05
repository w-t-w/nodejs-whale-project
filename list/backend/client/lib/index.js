const EasySock = require('easy_sock');
const fs = require('fs');
const path = require('path');
const protobuf = require('protocol-buffers');

const PROTO_DIR = path.resolve(process.cwd(), './list/backend/proto/column.proto');

const IP = '127.0.0.1',
    PORT = 7777,
    TIMEOUT = 500;

const seq_length = 4,
    package_header_length = 8;

const {ListRequest, ListResponse} = protobuf(fs.readFileSync(PROTO_DIR, 'utf-8'));

const socket = new EasySock({
    ip: IP,
    port: PORT,
    timeout: TIMEOUT,
    keepAlive: true
});

socket.isReceiveComplete = buffer => {
    if (buffer.length <= package_header_length)
        return 0;
    const body_length = buffer.readInt32BE(seq_length);
    if (buffer.length >= body_length + package_header_length)
        return body_length + package_header_length;
    else
        return 0;
};

socket.encode = (data, seq) => {
    const body = ListRequest.encode(data);
    const body_length = body.length;
    const header = Buffer.alloc(package_header_length);
    header.writeInt32BE(seq);
    header.writeInt32BE(body_length, seq_length);
    return Buffer.concat([header, body]);
};

socket.decode = buffer => {
    const seq = buffer.readInt32BE();
    const body = buffer.slice(package_header_length);
    const result = ListResponse.decode(body);
    return {
        seq,
        result
    };
};

module.exports = socket;