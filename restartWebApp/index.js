var ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient
var SubscriptionManagementClient = require('azure-arm-resource').SubscriptionClient
var WebSiteManagement = require('azure-arm-website')
var msRestAzure = require('ms-rest-azure')
var axios = require('axios')

const EventGridServices = require('./../common/EventGridServices')

module.exports = function (context, req) {
    var response = EventGridServices.validateSubscription(context)
    if (response) {
        context.res.send(response)
        context.done();
    }

    var clientId = process.env['CLIENT_ID']
    var tenantId = process.env['TENANT_ID']
    var secretId = process.env['SECRET_ID']
    var subscriptionId = process.env['SUBSCRIPTION_ID']

    var credentials = new msRestAzure.ApplicationTokenCredentials(clientId, tenantId, secretId);
    var webSiteClient = new WebSiteManagement(credentials, subscriptionId);
    var data = req.body[0].data
    var resourceGroupName = data.resourceGroupName
    var webAppName = data.webAppName    

    webSiteClient.webApps.restart(resourceGroupName, webAppName, null, function (err, result) {
        if (err) context.res = { status: 500, body: err }
        data.result = result
        context.res = data
        axios.post('https://61ba7e6f.ngrok.io/restart', context.res)
        context.done();
    })    
};