import uuid from 'uuid';
import AWS from 'aws-sdk';
import * as dynamoLib from './libs/dynamodb-lib';
import {
    success,
    failure
} from './libs/response-lib';


AWS.config.update({
    region: 'eu-central-1'
});
export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    
    const params = {
        TableName: "notes",
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: new Date().getTime()
        }
    };

    try {
        await dynamoLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        console.log(e);
        callback(null, failure({
            status: false
        }));
    }
}