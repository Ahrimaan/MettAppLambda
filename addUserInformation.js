import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure,
    notFound,
    noContent
} from "./libs/response-lib";

export async function main(event, context, callback) {
    console.log(event.body);
    console.log(event.requestContext.authorizer.principalId)
    const data = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.principalId.split('|')[1];
    const params = {
        TableName: "userInformation",
        Item: {
            userId: userId,
            tenant: data.tenantId,
            isAdmin:false,
            email: data.mail,
            username: data.username
        }
    };
    console.log(params);

    try {
        const result = await dynamoDbLib.call('put', params);
        console.log(result);
        if (result) {
            callback(null, success('OK'));
        } else {
            console.log(result);
            callback(null, failure({
                status: false,
                error: "Item not found."
            }));
        }
    } catch (e) {
        console.log(e);
        callback(null, failure({
            status: false
        }));
    }
}