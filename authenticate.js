// For further information about this authenticator see https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api

const jwt = require('jsonwebtoken')

// Set in `enviroment` of serverless.yml
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.auth = (event, context, callback) => {
  console.log('event', event)
  if (!event.authorizationToken) {
    return callback('Unauthorized')
  }

  const tokenParts = event.authorizationToken.split(' ')
  const tokenValue = tokenParts[1]

 
  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return callback('Unauthorized')
  }
  const options = {
    audience: AUTH0_CLIENT_ID,
  }


  // decode base64 secret. ref: http://bit.ly/2hA6CrO
  const secret = process.env.IS_BASE64 === 'true' ? new Buffer.from(AUTH0_CLIENT_SECRET, 'base64') : AUTH0_CLIENT_SECRET;
  try {
    jwt.verify(tokenValue, secret, options, (verifyError, decoded) => {
      if (verifyError) {
        console.log('verifyError', verifyError)
        // 401 Unauthorized
        console.log(`Token invalid. ${verifyError}`)
        return callback('Unauthorized')
      }
      // is custom authorizer function
      console.log('valid from customAuthorizer', decoded)
      // * is a fix for calling multiple APIs
      return callback(null, generatePolicy(decoded.sub, 'Allow', '*'))
    })
   } catch (err) {
    console.log('catch error. Invalid token', err)
    return callback('Unauthorized')
  }
}