import uuid from 'uuid';
import AWS from 'aws-sdk';
import * as dynamoLib from './libs/dynamodb-lib';
import {success, failure, unauthorized} from './libs/response-lib';

AWS
    .config
    .update({region: 'eu-central-1'});
export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const userId = event
        .requestContext
        .authorizer
        .principalId
        .split('|')[1];
    const getUserInfoParams = {
        TableName: "userInformation",
        Key: {
            userId: userId
        }
    };
    let userResult;
    try {
        userResult = await dynamoDbLib.call('get', getUserInfoParams);
        if (userResult.Item) {
            if (!userResult.Item.isAdmin) {
                return callback(null, unauthorized({status: false}));
            }
            if (!userResult.Item.paypalLink) {
                return callback(null, failure({status: false, message: 'please add a paypal link first'}));
            }
        } else {
            return callback(null, unauthorized({status: false}));
        }
    } catch (e) {
        console.log(e);
        return callback(null, unauthorized({status: false}));
    }

    const addEventsParams = {
        TableName: "events",
        Item: {
            userId: userId,
            eventDate: data.eventDate,
            createdAt: new Date().getTime(),
            participants: [],
            paypalLink: userResult.Item.paypalLink
        }
    };

    try {
        await dynamoLib.call("put", addEventsParams);
        callback(null, success(addEventsParams.Item));
    } catch (e) {
        console.log(e);
        callback(null, failure({status: false}));
    }
}