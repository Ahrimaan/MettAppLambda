import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure,
    notFound
} from "./libs/response-lib";

export async function main(event, context, callback) {
    const params = {
        TableName: "tenants",
        ProjectionExpression: 'tenantName, id'
      };

    try {
        const result = await dynamoDbLib.call('scan',params);
        if (result.Items) {
            callback(null, success(result.Items));
        } else {
            callback(null, notFound({
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