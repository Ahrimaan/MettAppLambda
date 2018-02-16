import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure,
    notFound,
    noContent
} from "./libs/response-lib";

export async function main(event, context, callback) {
    const userId = context.requestContext.authorizer.principalId.split('|')[1];
    const params = {
        TableName: "userInformation",
        Item: {
            userId: userId,
            tenant: event.tenantId,
            isAdmin:false,
            email: event.mail,
            username: event.username,
            paypalLink : event.paypalLink
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