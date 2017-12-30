import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure,
    notFound
} from "./libs/response-lib";

export async function main(event, context, callback) {
    const tenantID = event.headers['tenant'];
    console.log(tenantID);
    const params = {
        TableName: "events",
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId'
        //   partition key
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be Identity Pool identity id
        //   of the authenticated user
        KeyConditionExpression: "tenant = :tenant",
        ExpressionAttributeValues: {
          ":tenant": Number.parseInt(tenantID)
        }
      };

    try {
        const result = await dynamoDbLib.call('query',params);
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