import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure,
    notFound,
    noContent
} from "./libs/response-lib";

export async function main(event, context, callback) {
    const userId = event.pathParameters.id;
    const params = {
        TableName: "userInformation",
        Key:{
            userId:userId
        }
      };

    try {
        const result = await dynamoDbLib.call('get',params);
        if (result.Item) {
            callback(null, success(result.Item));
        } else {
            callback(null, noContent({
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