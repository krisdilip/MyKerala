var requestParms = {
    clientId: "1Z0JHDNFUX2UMUJYUEGXMO5Q52ZWUJNBNDM10KU02EGFOQNP",
    clientSecret: "SCC1IEJF5ARFRFQPHJEHVHOFCXUEY0XJ200Z0CXTG5HJEVX1",
    version: "20131230"
}

var app = angular.module('KeralaRestaurants.services', ['ngResource']);

app.factory('restaurantService', function ($resource) {

    var requestUri = 'https://api.foursquare.com/v2/venues/:action';

    return $resource(requestUri,
        {
            action: 'explore',
            client_id: requestParms.clientId,
            client_secret: requestParms.clientSecret,
            v: requestParms.version,
            venuePhotos: '1',
            callback: 'JSON_CALLBACK'
        },
        {
            get: { method: 'JSONP' }
        });

});
