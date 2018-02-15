import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure
} from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    let userID = event.requestContext.identity.cognitoIdentityId;
    const params = getUpdateParams(data,userID);
    try {
        const result = await dynamoDbLib.call("update", params);
        callback(null, success({
            status: true
        }));
    } catch (e) {
        console.log(e);
        callback(null, failure({
            status: false
        }));
    }
}

function getUpdateParams(data, userId) {
    if(data.tenant && !data.paypalLink) {
        return {
            TableName: "userInformation",
            Key: {
                userId: userId
            },
            UpdateExpression: "SET tenant = :tenant",
            ExpressionAttributeValues: {
                ":tenant": data.tenant ? data.tentant : null
            },
            ReturnValues: "ALL_NEW"
        };
    }
    if(data.paypalLink && !data.tenant) {
        return {
            TableName: "userInformation",
            Key: {
                userId: userId
            },
            UpdateExpression: "SET paypalLink = :paypalLink",
            ExpressionAttributeValues: {
                ":paypalLink": data.paypalLink ? data.paypalLink : null
            },
            ReturnValues: "ALL_NEW"
        };
    }
}