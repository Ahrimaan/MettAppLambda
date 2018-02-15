import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure
} from "./libs/response-lib";

export async function main(event, context, callback) {
    console.log("incoming update with data:  ", event);
    const data = event;
    console.log("Recieved data :" , data);
    let userID = data.userId;
    console.log("UserID:" , userID);
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
    console.log("Adding params: " , data," userid: ", userId)
    let params = {};
    if(data.tenant) {
        params = {
            TableName: "userInformation",
            Key: {
                userId: userId
            },
            UpdateExpression: "set tenant = :tenant",
            ExpressionAttributeValues: {
                ":tenant":  data.tenant
            },
            ReturnValues: "ALL_NEW"
        };
    }
    if(data.paypalLink) {
        params = {
            TableName: "userInformation",
            Key: {
                userId: userId
            },
            UpdateExpression: "set paypalLink = :paypalLink",
            ExpressionAttributeValues: {
                ":paypalLink": data.paypalLink
            },
            ReturnValues: "ALL_NEW"
        };
    }
    return params;
}