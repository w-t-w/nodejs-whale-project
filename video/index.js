const Koa = require('koa');
const {graphqlHTTP} = require('koa-graphql');

const schema = require('./lib');

const PORT = 7777;

const koa = new Koa();

koa.use(graphqlHTTP({
    schema
}));

koa.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}!`);
});