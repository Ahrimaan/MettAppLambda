import AWS from "aws-sdk";

AWS.config.update({
    region: "eu-central-1"
});

export function call(action, params) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    return dynamoDb[action](params).promise();
}

export function query(params) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    return dynamoDb.query(params).promise();
}