import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure
} from "./libs/response-lib";

export async function main(event, context, callback) {
    console.log("incoming update with data:  ", event);
    const data = JSON.parse(event.body);
    
    let userID = data.userId;
    const params = getUpdateParams(data,userID);
    console.log("DB Params:" , params);
    try {
        const result = await dynamoDbLib.call("update", params);
        callback(null, success({
            status: true
        }));
    } catch (e) {
        console.log(e);
        let error = new Error(e);
        callback(null,failure(e));
    }
}

function getUpdateParams(data, userId) {
    if(data.tenant) {
        return {
            TableName: "userInformation",
            Key: {
                userId: userId
            },
            UpdateExpression: "set tenant = :tenant",
            ExpressionAttributeValues: {
                ":tenant":  { "S" :  data.tenant}
            },
            ReturnValues: "ALL_NEW"
        };
    }
    if(data.paypalLink) {
        return {
            TableName: "userInformation",
            Key: {
                userId: userId
            },
            UpdateExpression: "set paypalLink = :paypalLink",
            ExpressionAttributeValues: {
                ":paypalLink": { "S" :  data.paypalLink}
            },
            ReturnValues: "ALL_NEW"
        };
    }
}