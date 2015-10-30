/**
 * Created by Sumin K Sudhi on 11/11/2014.
 */

define(['modules/common/config/initModule'],function (Hairzzlers) {
    'use strict';
    Hairzzlers.factory('appUtil',function () {
        var appUtil = {};
        /**
         * used in web services(ObjectServer) to manipulate the attribute params
         * @param jsonObj
         * @returns {{name: string, value: (*|string)}}
         */
        appUtil.concatAttribNameVal= function (jsonObj) { //pass the json Object of web service to get the conacted String
            return  {name: Object.keys(jsonObj).join('~'), value: $.map(jsonObj, function (value, index) {
                return [value];
            }).join('~')};
        };

        /**
         * used to modify $http to an ajax call
         * @param data
         * @param getHeaders
         * @returns {*}
         */
        appUtil.transformRequestAsFormPost= function (data, getHeaders) {
            var headers = getHeaders();
            headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
            return appUtil.serializeData(data);
        };




        /** use to scroll to an Id **/
        appUtil.scrollSmooth =  function(eId) {
                if(!eId){
                    return false;
                }
                function currentYPosition() {
                    // Firefox, Chrome, Opera, Safari
                    if (self.pageYOffset) return self.pageYOffset;
                    // Internet Explorer 6 - standards mode
                    if (document.documentElement && document.documentElement.scrollTop)
                        return document.documentElement.scrollTop;
                    // Internet Explorer 6, 7 and 8
                    if (document.body.scrollTop) return document.body.scrollTop;
                    return 0;
                }


                function elmYPosition(eID) {
                    var elm = document.getElementById(eID);
                    var y = elm.offsetTop;
                    var node = elm;
                    while (node.offsetParent && node.offsetParent != document.body) {
                        node = node.offsetParent;
                        y += node.offsetTop;
                    } return y;
                }
                var startY = currentYPosition();
                var stopY = elmYPosition(eId);
                var distance = stopY > startY ? stopY - startY : startY - stopY;
                if (distance < 100) {
                    scrollTo(0, stopY);
                    return;
                }
                var speed = Math.round(distance / 100);
                if (speed >= 20) speed = 20;
                var step = Math.round(distance / 25);
                var leapY = stopY > startY ? startY + step : startY - step;
                var timer = 0;
                if (stopY > startY) {
                    for (var i = startY; i < stopY; i += step) {
                        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                        leapY += step;
                        if (leapY > stopY) leapY = stopY;
                        timer++;
                    }
                    return;
                }
                for (var i = startY; i > stopY; i -= step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY -= step;
                    if (leapY < stopY) leapY = stopY;
                    timer++;
                }
                return false;
            }


        /**
         * set the cookie
         * @param c_name key name of cookie
         * @param value value to be stored
         * @param extime expiry date of cookie
         */
        appUtil.setCookie = function(c_name, value, extime) {
            var d = new Date();
            d.setTime(d.getTime() + (extime*60*1000));
            var c_value = escape(value) + ((extime === null) ? "" : "; expires=" + d.toUTCString());
            document.cookie = c_name + "=" + c_value;
        };

        /**
         * create a cookie
         * @param cookie cookie to set
         * @param fun @todo dont know
         */
        appUtil.createCookie = function (cookie) {
            var rememberChecked=window.localStorage.rememberChecked || false;
            if(window.localStorage.usercookie==null)
                window.localStorage.usercookie=cookie;
            var usertoken=JSON.parse(cookie);
            if(rememberChecked=='true')
                appUtil.setCookie('usertoken', usertoken.session.token, sessionExtendTime);
            else
                appUtil.setCookie('usertoken', usertoken.session.token);


           // setUserIdTenantId();
        };

        /**
         * get the User Cookie
         * @param c_name key name of cookie to get
         * @returns {*}
         */
        appUtil.getCookie = function(c_name) {
            var i, x, y, ARRcookies = document.cookie.split(";");
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x == c_name) {
                    return unescape(y);
                }
            }
        };

        /**
         * could be used to detect subdomains
         * @returns {*|jQuery}
         */
        appUtil.subdomainName = function(){
            return $(location).attr('host').match(/(?:http[s]*\:\/\/)*(.*?)\.(?:[^\/]*\..{1,5})/i);
        };

        /**
         * used to serialize ObjectData
         * @param data
         * @returns {string}
         */
        appUtil.serializeData=function(data) {
            // I serialize the given Object into a key-value pair string. This
            // method expects an object and will default to the toString() method.
            // --
            // NOTE: This is an atered version of the jQuery.param() method which
            // will serialize a data collection for Form posting.
            // --
            // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
            if (!angular.isObject(data)) {
                return( ( data == null ) ? "" : data.toString() );
            }
            var buffer = [];
            for (var name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }
                var value = data[ name ];
                buffer.push(
                        encodeURIComponent(name) + "=" + encodeURIComponent(( value == null ) ? "" : value)
                );
            }
            // Serialize the buffer and clean it up for transportation.
            var source = buffer
                    .join("&")
                    .replace(/%20/g, "+")
                ;
            return( source );
        };
        return appUtil;
    });
});