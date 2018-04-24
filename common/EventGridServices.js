var EventGridServices = {}

EventGridServices.validateSubscription = (context) => {
    var header = context.req.get("Aeg-Event-Type");
    var response = undefined;
    if (header && header === 'SubscriptionValidation') {
        var event = context.req.body[0]
        var isValidationEvent = event && event.data &&
            event.data.validationCode &&
            event.eventType && event.eventType == 'Microsoft.EventGrid.SubscriptionValidationEvent'
        if (isValidationEvent) {
            response = { "validationResponse": event.data.validationCode }
        }
    }
    return response
}

module.exports = EventGridServices;