/**
 * Maintains the position in the world.
 * Allows for updates from the gps system and frequent "where-am-I-now" queries.
 * Current position is estimated based on last GPS update.
 * @class
 */
function GeoPosition() {
    "use strict";

    var currentGeoLocation;
    var zeroLat;
    var zeroLon;
    var speed; // in meters per second
    var speedX;
    var speedY;

    // in meters respective to zeroLat and zeroLon
    var positionX;
    var positionY;

    var geoLocationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    var self = this;
    var geoLocationId = navigator.geolocation.watchPosition(function(geoLocation) {
        return self.updateGeoLocation(geoLocation);
    }
        , this.updatePositionFail, geoLocationOptions);
}


/**
 * Set the GPS position to be used as point 0,0 on the x/y axis.
 * If not set the first GPS position will be used.
 * Will overwrite existing zero position.
 */
GeoPosition.prototype.setZeroLocation = function (newZeroLat, newZeroLon) {
    this.zeroLat = newZeroLat;
    this.zeroLon = newZeroLon;
}

GeoPosition.prototype.updatePosition = function (geoLocation) {

    var pos = geoLocation.coords;
    console.log("latitude:" + pos.latitude + ", longitude:" + pos.longitude + ", accuracy: " + pos.accuracy + ", heading: " + pos.heading + ", speed:" + pos.speed);
}

GeoPosition.prototype.updatePositionFail = function (error) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

/**
 * Calculates the distance between the two points in meters using the Haversine method.
 * source: http://www.movable-type.co.uk/scripts/latlong.html
 */
GeoPosition.prototype.calculateDistance = function (lat1, lon1, lat2, lon2) {
    var R = 6371000; // earth radius in meters
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

GeoPosition.prototype.toRad = function (x) {
    return x * Math.PI / 180;
}

/**
 * Backdoor to private methods.
 * This way a unit test can test a private method by calling GPSUtil._private('calculateDistance', arguments);
 */
/*
    api._private = function () {
        var re = /(\(\))$/,
            args = [].slice.call(arguments),
            name = args.shift(),
            is_method = re.test(name),
            name = name.replace(re, ''),
            target = eval(name);
        return is_method ? target.apply(this, args) : target;
    }
*/

/**
 * Calculates the distances between the two gps points.
 * @return {distance: total distance traveled in meters,
 *  distanceX: distance traveled east-west/X-axis in meters
 *  distanceY: distance traveled north-sout/Y-axis in meters
 * }
 * Distance x/y will be negative if traveled south/west.
 */
GeoPosition.prototype.calculateDistances = function(lat1, lon1, lat2, lon2) {
    var distance = this.calculateDistance(lat1, lon1, lat2, lon2);

    // distance traveled over latitude/y-axis in meters
    // calculated by measuring the distance between old and new lat, keeping lon constant
    var distanceY = this.calculateDistance(lat1, lon1, lat2, lon1); // yes, lon1 twice

    // distance traveled over longitude/x-axis in meters
    // calculated by pythagoras formula on distance and distanceY
    var distanceX = Math.sqrt((distance * distance) - (distanceY * distanceY));

    distanceX = this.calculateXSign(lon1, lon2) * distanceX;
    distanceY = this.calculateYSign(lat1, lat2) * distanceY;

    return {
        distance: distance,
        distanceX: distanceX,
        distanceY: distanceY
    };
}

GeoPosition.prototype.hello = function() {
    alert('hi');
}


/**
 * Update current speed/distance/heading with information from the given geoLocation.
 */
GeoPosition.prototype.updateGeoLocation = function(geoLocation) {
    var pos = geoLocation.coords;
    console.log("latitude:" + pos.latitude + ", longitude:" + pos.longitude + ", accuracy: " + pos.accuracy + ", heading: " + pos.heading + ", speed:" + pos.speed);
    if (this.currentGeoLocation === undefined) {
        this.speed = 0;
        this.currentGeoLocation = geoLocation;

        if (this.zeroLat === undefined) {
            this.zeroLat = this.currentGeoLocation.coords.latitude;
            this.zeroLon = this.currentGeoLocation.coords.longitude;
            var absoluteDistances = this.calculateDistances(this.zeroLat, this.zeroLon, geoLocation.coords.latitude, geoLocation.coords.longitude);
            this.positionX = absoluteDistances.distanceX;
            this.positionY = absoluteDistances.distanceY;
        } else {
            this.positionX = 0;
            this.positionY = 0;
        }

        return {
            x: this.positionX,
            y: this.positionY
        }
    }

    var currentPos = this.currentGeoLocation.coords;
    var newPos = geoLocation.coords;

    var distances = this.calculateDistances(
        currentPos.latitude, 
        currentPos.longitude, 
        newPos.latitude, 
        newPos.longitude);
    var dTime = geoLocation.timestamp - this.currentGeoLocation.timestamp;
    this.speed = 1000 * (distances.distance / dTime);
    this.speedX = 1000 * (distances.distanceX / dTime);
    this.speedY = 1000 * (distances.distanceY / dTime);

    this.currentGeoLocation = geoLocation;

    var absoluteDistances = this.calculateDistances(this.zeroLat, this.zeroLon, newPos.latitude, newPos.longitude);
    this.positionX = absoluteDistances.distanceX;
    this.positionY = absoluteDistances.distanceY;

    return {
        x: this.positionX,
        y: this.positionY
    }
}

/**
 * Whether the distance traveled was in the eastern direction (returning 1) or west (returning -1)
 * Will not work correctly if oldLon,newLon are crossing the 180th meridian
 */
GeoPosition.prototype.calculateXSign = function (oldLon, newLon) {
    if (oldLon > newLon) {
        return -1;
    } else {
        return 1;
    }
}

/**
 * Whether the distance traveled was in the northern direction (returning 1) or south (returning -1)
 * Will not work correctly if oldLat and newLat are on opposite sides of the north or sout pole.
 */
GeoPosition.prototype.calculateYSign = function (oldLat, newLat) {
    if (oldLat > newLat) {
        return -1;
    } else {
        return 1;
    }
}


/**
 * Time expired since January 1st, 1970 in milliseconds
 */
GeoPosition.prototype.getCurrentTimestamp = function () {
    return new Date().getTime();
}

/**
 * Assuming we move at a constant speed and rate then where will be at the given time
 * @param time time in milliseconds since January 1st, 1970
 */
GeoPosition.prototype.getPositionAtTime = function (time) {
    if (this.currentGeoLocation === undefined) {
        return undefined;
    }

    if (this.speed == 0) {
        return {
            x: this.positionX,
            y: this.positionY
        }
    }


    var dTime = (time - this.currentGeoLocation.timestamp) / 1000;
    var timedPositionX = this.positionX + (this.speedX * dTime);
    var timedPositionY = this.positionY + (this.speedY * dTime);
    return {
        x: timedPositionX,
        y: timedPositionY
    }
}

/**
 * Calculates where we end up if we travel from point a to point b for distance d.
 *
 * @return {{positionX: the position on the x-axis, positionY: the position on the y-axis}}
 */
GeoPosition.prototype.getPositionAtDistance = function (x1, y1, x2, y2, d) {

    var angle = Math.abs(y2 - y1) / Math.abs(x2 - x1);

    var dX = (d * Math.cos(angle));
    if (x1 > x2) {
        dX = -dX;
    }
    var x = x1 + dX;

    var dY = (d * Math.sin(angle));
    if (y1 > y2) {
        dY = -dY;
    }
    var y = y1 + dY;

    return {
        x: x,
        y: y
    }
}


/**
 * The position at dTime in the future if we move from our current position to where we should be according to the GPS.
 *
 * @param currentX our position in meters relative to zeroLat
 * @param currentY our position in meters relative to zerLon
 * @param dTime time in milliseconds from now
 * @param currentTime (optional) the current time in milliseconds since January 1st, 1970. Useful for testing purposes, defaults to the actual current time.
 *
 * @return {positionX: our position-to-be in meters relative to zerLat, positionY: our position-to-be in meters relative to zerLon, speed: our current speed in meters per second, lastGeoLocation: the last geoLocation used to calculate all of this}
 */
GeoPosition.prototype.getFuturePosition = function (currentX, currentY, dTime, currentTime) {
    // GPS is not initialized yet
    if (this.currentGeoLocation === undefined) {
        return {
            x: currentX,
            y: currentY
        }
    }

    // we're standing still
    if (this.speed === 0) {
        return {
            x: currentX,
            y: currentY,
            speed: 0,
            lastGeoLocation: this.currentGeoLocation
        }
    }

    // where should we be at time timestamp
    currentTime = currentTime || this.getCurrentTimestamp();
    var whereWeShouldBeAtDTime = this.getPositionAtTime(currentTime + dTime);

    // travel at our current speed during dTime from our current postion in the direction of where we should be
    var distance = this.speed * (dTime / 1000);

    var positionAtDistance = this.getPositionAtDistance(currentX, currentY, whereWeShouldBeAtDTime.x, whereWeShouldBeAtDTime.y, distance);

    return {
        x: positionAtDistance.x,
        y: positionAtDistance.y,
        speed: this.speed,
        lastGeoLocation: this.currentGeoLocation
    };
}


GeoPosition.prototype.updatePosition = function (geoLocation) {

    var pos = geoLocation.coords;
    console.log("latitude:" + pos.latitude + ", longitude:" + pos.longitude + ", accuracy: " + pos.accuracy + ", heading: " + pos.heading + ", speed:" + pos.speed);
    /*
            if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
                console.log('Congratulation, you reach the target');
                navigator.geolocation.clearWatch(id);
            }
            */
}
