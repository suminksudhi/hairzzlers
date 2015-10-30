var express = require('express'),
    router = express.Router(),
    foursquare = require('./index')();

router
    .route(['/foursquare'])
    .get(foursquare.searchArea)


module.exports = router;