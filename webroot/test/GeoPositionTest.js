// disable browser watchPosition
navigator.geolocation.watchPosition = function() {
}

// how precise do we compare floats
var PRECISION = 0.0000001;

QUnit.test("geoPos.calculateDistance", function(assert) {
	var geoPos = new GeoPosition();
    QUnit.close(geoPos.calculateDistance(52.4490101, 4.8187594, 52.4490848, 4.8187594), 8.306261020235553, PRECISION, "calculate distance strictly north-south");
    QUnit.close(geoPos.calculateDistance(52.4490101, 4.8187594, 52.4490848, 4.8186594), 10.720129063617216, PRECISION, "calculate distance from south-east to north-west");
});

QUnit.test("geoPos.calculateDistances", function(assert) {
	var geoPos = new GeoPosition();
    var distances = geoPos.calculateDistances(52.4490101, 4.8187594, 52.4490848, 4.8186594);

    QUnit.close(distances.distance, 10.720129063617216, PRECISION, "calculate distance from south-east to north-west");
    QUnit.close(distances.distanceX, -6.776960602240946, PRECISION, "distanceX");
    QUnit.close(distances.distanceY, 8.306261020235553, PRECISION, "distanceY");
});


QUnit.test("geoPos.getPositionAtDistance (0, 0) => 1 => (2, 1)", function(assert) {
    var distance = 1;
	var geoPos = new GeoPosition();
    var pos = geoPos.getPositionAtDistance(0, 0, 2, 1, distance);

    QUnit.close(pos.x, 0.8944271909999159, PRECISION, "positionX");
    QUnit.close(pos.y, 0.4472135954999579, PRECISION, "positionY");
    QUnit.close(Math.sqrt((pos.x * pos.x) + (pos.y * pos.y)), distance, PRECISION, "total distance");
});

QUnit.test("geoPos.getPositionAtDistance (0,0) => 1 => (2, -1)", function(assert) {
    var distance = 1;
	var geoPos = new GeoPosition();
    var pos = geoPos.getPositionAtDistance(0, 0, 2, -1, distance);

    QUnit.close(pos.x, 0.8944271909999159, PRECISION, "positionX");
    QUnit.close(pos.y, -0.4472135954999579, PRECISION, "positionY");
    QUnit.close(Math.sqrt((pos.x * pos.x) + (pos.y * pos.y)), distance, PRECISION, "total distance");
});

QUnit.test("geoPos.getPositionAtDistance (1, 2) => 0.5 => (3, 4)", function(assert) {
	var geoPos = new GeoPosition();
    var distance = 0.5;
    var pos = geoPos.getPositionAtDistance(1, 2, 3, 3, distance);

    QUnit.close(pos.x, 1.4472135954999579, PRECISION, "positionX");
    QUnit.close(pos.y, 2.223606797749979, PRECISION, "positionY");
    QUnit.close(Math.sqrt(Math.pow(pos.x - 1, 2) + Math.pow(pos.y - 2, 2)), distance, PRECISION, "total distance");
});

//QUnit.test("geoPos.getPositionAtDistance 4", function(assert) {
//	var geoPos = new GeoPosition();
//    var distance = 0.5;
//
//    var testDataSet = [[[1,2,3,4],[1.2701511529340699,2.4207354924039484]],
//        [[1,2,4,3],[1.2701511529340699,2.4207354924039484]],
//        [[1,3,2,4],[1.2701511529340699,2.4207354924039484]],
//        [[1,3,4,2],[1.2701511529340699,2.4207354924039484]],
//        [[1,4,2,3],[1.2701511529340699,2.4207354924039484]],
//        [[1,4,3,2],[1.2701511529340699,2.4207354924039484]],
//        [[2,1,4,3],[1.2701511529340699,2.4207354924039484]],
//        [[2,1,3,4],[1.2701511529340699,2.4207354924039484]],
//        [[2,3,4,1],[1.2701511529340699,2.4207354924039484]],
//        [[2,3,1,4],[1.2701511529340699,2.4207354924039484]],
//        [[2,4,3,1],[1.2701511529340699,2.4207354924039484]],
//        [[2,4,1,3],[1.2701511529340699,2.4207354924039484]],
//        [[3,1,2,4],[1.2701511529340699,2.4207354924039484]],
//        [[3,1,4,2],[1.2701511529340699,2.4207354924039484]],
//        [[3,2,1,4],[1.2701511529340699,2.4207354924039484]],
//        [[3,2,4,1],[1.2701511529340699,2.4207354924039484]],
//        [[3,4,1,2],[1.2701511529340699,2.4207354924039484]],
//        [[3,4,2,1],[1.2701511529340699,2.4207354924039484]],
//        [[4,1,3,2],[1.2701511529340699,2.4207354924039484]],
//        [[4,1,2,3],[1.2701511529340699,2.4207354924039484]],
//        [[4,2,3,1],[1.2701511529340699,2.4207354924039484]],
//        [[4,2,1,3],[1.2701511529340699,2.4207354924039484]],
//        [[4,3,2,1],[1.2701511529340699,2.4207354924039484]],
//        [[4,3,1,2],[3.527521526842631, 2.836402651601924]]];
//
//    for (var i = 0; i < testDataSet.length; i++) {
//        var testData = testDataSet[i];
//        var pos = geoPos.getPositionAtDistance(testData[0][0], testData[0][1], testData[0][2], testData[0][3], distance);
//        var messagePrefix = "(" + testData[0][0] + ", " + testData[0][1] + ") => (" + testData[0][2] + ", " + testData[0][3] + "): ";
//        QUnit.close(pos.x, testData[1][0], PRECISION, messagePrefix + "x");
//        QUnit.close(pos.y, testData[1][1], PRECISION, messagePrefix + "y");
//    }
//});


QUnit.test("geoPos.calculateXSign", function(assert) {
	var geoPos = new GeoPosition();
    QUnit.close(geoPos.calculateXSign(2, 1), -1, "2 => 1");
    QUnit.close(geoPos.calculateXSign(1, 2), 1, "1 => 2");
    QUnit.close(geoPos.calculateXSign(0, 0), 1, "0 => 0");
    QUnit.close(geoPos.calculateXSign(-1, -2), -1, "-1 => -2");
    QUnit.close(geoPos.calculateXSign(-2, -1), 1, "-2 => -1");
    QUnit.close(geoPos.calculateXSign(1, -1), -1, "1 => -1");
    QUnit.close(geoPos.calculateXSign(-1, 1), 1, "-1 => 1");
//     QUnit.close(geoPos._private('calculateXSign')(179, -179), -1, "179 => -179");
//     QUnit.close(geoPos._private('calculateXSign')(-179, 179), 1, "-179 => 179");
});


QUnit.test("geoPos.calculateYSign", function(assert) {
	var geoPos = new GeoPosition();
    QUnit.close(geoPos.calculateYSign(2, 1), -1, "2 => 1");
    QUnit.close(geoPos.calculateYSign(1, 2), 1, "1 => 2");
    QUnit.close(geoPos.calculateYSign(0, 0), 1, "0 => 0");
    QUnit.close(geoPos.calculateYSign(-1, -2), -1, "-1 => -2");
    QUnit.close(geoPos.calculateYSign(-2, -1), 1, "-2 => -1");
    QUnit.close(geoPos.calculateYSign(1, -1), -1, "1 => -1");
    QUnit.close(geoPos.calculateYSign(-1, 1), 1, "-1 => 1");
});


QUnit.test("geoPos.update initial", function(assert) {
	var geoPos = new GeoPosition();
    var geoLocation = {
        timestamp: 0,
        coords: {
            latitude: 52.4490101,
            longitude: 4.8187594
        }
    };
    geoPos.updateGeoLocation(geoLocation);

    QUnit.close(geoPos.speed, 0, "speed");
});

QUnit.test("geoPos.updateGeoLocation 1 second", function(assert) {
	var geoPos = new GeoPosition();
    var geoLocation1 = {
        timestamp: 0,
        coords: {
            latitude: 52.4490101,
            longitude: 4.8187594
        }
    };
    geoPos.updateGeoLocation(geoLocation1);

    var geoLocation2 = {
        timestamp: 1000,
        coords: {
            latitude: 52.4490848,
            longitude: 4.8186594
        }
    };
    geoPos.updateGeoLocation(geoLocation2);

    QUnit.close(geoPos.speed, 10.720129063617216, PRECISION, "speed");
    QUnit.close(geoPos.speedX, -6.776960602240946, PRECISION, "speedX");
    QUnit.close(geoPos.speedY, 8.306261020235553, PRECISION, "speedY");
});


QUnit.test("geoPos.updateGeoLocation 2 seconds", function(assert) {
	var geoPos = new GeoPosition();
    var geoLocation1 = {
        timestamp: 0,
        coords: {
            latitude: 52.4490101,
            longitude: 4.8187594
        }
    };
    geoPos.updateGeoLocation(geoLocation1);

    var geoLocation2 = {
        timestamp: 2000,
        coords: {
            latitude: 52.4490848,
            longitude: 4.8186594
        }
    };
    geoPos.updateGeoLocation(geoLocation2);

    QUnit.close(geoPos.speed, 5.360064531808608, PRECISION, "speed");
    QUnit.close(geoPos.speedX, -3.388480301120473, PRECISION, "speedX");
    QUnit.close(geoPos.speedY, 4.1531305101177765, PRECISION, "speedY");
});



QUnit.test("geoPos.getPositionAtTime 0.5 second", function(assert) {
	var geoPos = new GeoPosition();
    var geoLocation1 = {
        timestamp: 0,
        coords: {
            latitude: 52.4490101,
            longitude: 4.8187594
        }
    };
    geoPos.updateGeoLocation(geoLocation1);

    var geoLocation2 = {
        timestamp: 1000,
        coords: {
            latitude: 52.4490848,
            longitude: 4.8186594
        }
    };
    geoPos.updateGeoLocation(geoLocation2);

    var position = geoPos.getPositionAtTime(500);
    QUnit.close(position.x, -3.388480301120473, PRECISION, "positionX");
    QUnit.close(position.y, 4.1531305101177765, PRECISION, "positionY");
});


QUnit.test("geoPos.getFuturePosition unitialized", function(assert) {
	var geoPos = new GeoPosition();
    var pos = geoPos.getFuturePosition(17, 23, 3);

    QUnit.close(pos.x, 17.0, PRECISION, "positionX");
    QUnit.close(pos.y, 23.0, PRECISION, "positionY");
    QUnit.close(pos.lastGeoLocation, undefined, "last geoLocation");
});

QUnit.test("geoPos.getFuturePosition speed 0", function(assert) {
	var geoPos = new GeoPosition();
    var geoLocation1 = {
        timestamp: 3,
        coords: {
            latitude: 52.4490101,
            longitude: 4.8187594
        }
    };
    geoPos.updateGeoLocation(geoLocation1);

    var pos = geoPos.getFuturePosition(17, 23, 3000);

    QUnit.close(pos.x, 17.0, PRECISION, "positionX");
    QUnit.close(pos.y, 23.0, PRECISION, "positionY");
    QUnit.close(pos.speed, 0.0, PRECISION, "speed");
    QUnit.close(pos.lastGeoLocation.timestamp, 3, "last geoLocation timestamp");
});

QUnit.test("geoPos.getFuturePosition 0.5 second", function(assert) {
	var geoPos = new GeoPosition();
    var geoLocation1 = {
        timestamp: 0,
        coords: {
            latitude: 52.4490101,
            longitude: 4.8187594
        }
    };
    geoPos.updateGeoLocation(geoLocation1);

    var geoLocation2 = {
        timestamp: 1000,
        coords: {
            latitude: 52.4490848,
            longitude: 4.8186594
        }
    };
    geoPos.updateGeoLocation(geoLocation2);

    var pos = geoPos.getFuturePosition(0, 0, 500, 500);
    QUnit.close(pos.x, -3.388480301120473, PRECISION, "positionX");
    QUnit.close(pos.y, 4.1531305101177765, PRECISION, "positionY");
});

QUnit.test("geoPos.getFuturePosition 25 meters in 1 second", function(assert) {
	var geoPos = new GeoPosition();
	var gps1 = {lat:52.372833, lon:4.892020}
	var gps2 = {lat: 52.373058, lon: 4.892020}

	var distances = geoPos.calculateDistances(gps1.lat, gps1.lon, gps2.lat, gps2.lon);

    QUnit.close(distances.distance, 25.01885849506617, PRECISION, "distance");

    var geoLocation1 = {
        timestamp: 0,
        coords: {
            latitude: gps1.lat,
            longitude: gps1.lon
        }
    };
    geoPos.updateGeoLocation(geoLocation1);

    var geoLocation2 = {
        timestamp: 1000,
        coords: {
            latitude: gps2.lat,
            longitude: gps2.lon
        }
    };
    geoPos.updateGeoLocation(geoLocation2);

    var pos = geoPos.getFuturePosition(0, 25, 500, 1000);
    QUnit.close(pos.x, 0.0, PRECISION, "pos.x");
    QUnit.close(pos.y, 37.509429247533085, PRECISION, "pos.y");
});
