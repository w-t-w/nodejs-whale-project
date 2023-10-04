const {buildSchema} = require('graphql');
const fs = require('fs');
const path = require('path');

const comments = require('../data');

const GRAPHQL_DIR = path.resolve(__dirname, '../gql/comments.gql');

const schema = buildSchema(fs.readFileSync(GRAPHQL_DIR, 'utf-8'));

schema.getQueryType().getFields().comments.resolve = () => {
    return comments;
};

schema.getMutationType().getFields().praise.resolve = (argv0, {id}) => {
    const comment = comments.find(item => item.id === id);
    return comment && ++comment['praiseNum'];
};

module.exports = schema;