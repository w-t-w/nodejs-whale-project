const path = require('path');
const fs = require('fs');
const EasySock = require('easy_sock');
const protobuf = require('protocol-buffers');

const seq_length = 4,
    package_header_length = 8;

const IP = '127.0.0.1',
    PORT = 7777,
    TIMEOUT = 500;

const PROTO_DIR = path.resolve(process.cwd(), './detail/proto/column.proto');
const {DetailRequest, DetailResponse} = protobuf(fs.readFileSync(PROTO_DIR, 'utf-8'));

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
    if (buffer.length >= package_header_length + body_length)
        return package_header_length + body_length;
    else
        return 0;
};

socket.encode = (data, seq) => {
    const body = DetailRequest.encode(data);
    const body_length = body.length;
    const header = Buffer.alloc(package_header_length);
    header.writeInt32BE(seq);
    header.writeInt32BE(body_length, seq_length);
    return Buffer.concat([header, body]);
};

socket.decode = buffer => {
    const seq = buffer.readInt32BE();
    const body = buffer.slice(package_header_length);
    const result = DetailResponse.decode(body);
    return {
        seq,
        result
    };
};

module.exports = socket;