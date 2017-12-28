import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure,
    notFound
} from "./libs/response-lib";

export async function main(event, context, callback) {
    const tenantID = event.headers['tenant'];
    const params = {
        TableName: "appointments",
        Key: {
            tenantID: tenantID
        }
    };

    try {
        const result = await dynamoDbLib.call("get", params);
        if (result.Items) {
            callback(null, success(result.Item));
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