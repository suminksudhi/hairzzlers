var prop = require('properties-parser'),
    request = require('request');

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

var foursquare = function() {
    var propertyPath = process.env.NB_HOME || 'config',
        propertyfile = propertyPath + '/application.properties';

    return {
        getProperties : function(){
            prop.read(propertyfile, function (err, data) {
                if (err) {
                    res.json(err);
                    return;
                }
                res.json(data);
            })
        },
        searchArea : function(req,res,next){
            var ip = req.query.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;
            var satelize = require('satelize');

            satelize.satelize({ip:ip}, function(err, geoData) {
                // process err
                /**
                 * {
                        "ip": "46.19.37.108",
                        "country_code": "NL",
                        "country_code3": "NLD",
                        "country": "Netherlands",
                        "continent_code": "EU",
                        "latitude": 52.5,
                        "longitude": 5.75,
                        "dma_code": "0",
                        "area_code": "0",
                        "asn": "AS196752",
                        "isp": "Tilaa V.O.F.",
                        "timezone":"Europe/Amsterdam"
                    }
                 */

                // if data is JSON, we may wrap it in js object
                var geoData = JSON.parse(geoData);
                prop.read(propertyfile, function (err, property) {
                    if (err) {
                        res.json(err);
                        return;
                    }
                    request({
                        method: 'GET',
                        uri: 'https://api.foursquare.com/v2/venues/search',
                        qs: {
                            ll: geoData.latitude+','+geoData.longitude,
                            client_id: property['foursquare.ClientID'],
                            client_secret: property['foursquare.ClientSecret'],
                            v: '20141209'
                        }
                    }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var info = { geoData : geoData };
                            info = extend({},info,JSON.parse(body));
                            res.json(info);
                        } else {
                            res.json(error);
                        }
                    })
                })


                // if used with expressjs
                // res.send(geoData);
                // res.json...
            });

        }
    }

}


module.exports = foursquare;
