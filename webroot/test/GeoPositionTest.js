// disable browser watchPosition
navigator.geolocation.watchPosition = function() {
}

// nr of digits to use when comparing floats
var NR_DIGITS = 8;

QUnit.test("geoPos.calculateDistance", function(assert) {
	var geoPos = new GeoPosition();
    assert.equal(geoPos.calculateDistance(52.4490101, 4.8187594, 52.4490848, 4.8187594).toFixed(NR_DIGITS),
8.306261020235553.toFixed(NR_DIGITS), "calculate distance strictly north-south");
    assert.equal(geoPos.calculateDistance(52.4490101, 4.8187594, 52.4490848, 4.8186594).toFixed(NR_DIGITS),
10.720129063617216.toFixed(NR_DIGITS), "calculate distance from south-east to north-west");
});

QUnit.test("geoPos.calculateDistances", function(assert) {
	var geoPos = new GeoPosition();
    var distances = geoPos.calculateDistances(52.4490101, 4.8187594, 52.4490848, 4.8186594);

    assert.equal(distances.distance.toFixed(NR_DIGITS), 10.720129063617216.toFixed(NR_DIGITS), "calculate distance from south-east to north-west");
    assert.equal(distances.distanceX.toFixed(NR_DIGITS), -6.776960602240946.toFixed(NR_DIGITS), "distanceX");
    assert.equal(distances.distanceY.toFixed(NR_DIGITS), 8.306261020235553.toFixed(NR_DIGITS), "distanceY");
});


QUnit.test("geoPos.getPositionAtDistance 1", function(assert) {
	var geoPos = new GeoPosition();
    var distance = 1;
    var pos = geoPos.getPositionAtDistance(0, 0, 2, 1, distance);

    assert.equal(pos.x.toFixed(NR_DIGITS), 0.8775825618903728.toFixed(NR_DIGITS), "positionX");
    assert.equal(pos.y.toFixed(NR_DIGITS), 0.479425538604203.toFixed(NR_DIGITS), "positionY");
    assert.equal(Math.sqrt((pos.x * pos.x) + (pos.y * pos.y)), distance.toFixed(NR_DIGITS), "total distance");
});

QUnit.test("geoPos.getPositionAtDistance 2", function(assert) {
	var geoPos = new GeoPosition();
    var distance = 1;
    var pos = geoPos.getPositionAtDistance(0, 0, 2, -1, distance);

    assert.equal(pos.x.toFixed(NR_DIGITS), 0.8775825618903728.toFixed(NR_DIGITS), "positionX");
    assert.equal(pos.y.toFixed(NR_DIGITS), -0.479425538604203.toFixed(NR_DIGITS), "positionY");
    assert.equal(Math.sqrt((pos.x * pos.x) + (pos.y * pos.y)), distance.toFixed(NR_DIGITS), "total distance");
});

QUnit.test("geoPos.getPositionAtDistance 3", function(assert) {
	var geoPos = new GeoPosition();
    var distance = 1;
    var pos = geoPos.getPositionAtDistance(1, 2, 3, 3, distance);

    assert.equal(pos.x.toFixed(NR_DIGITS), 1.8775825618903728.toFixed(NR_DIGITS), "positionX");
    assert.equal(pos.y.toFixed(NR_DIGITS), 2.479425538604203.toFixed(NR_DIGITS), "positionY");
});

QUnit.test("geoPos.getPositionAtDistance 4", function(assert) {
	var geoPos = new GeoPosition();
    var distance = 0.5;

    var testDataSet = [[[1,2,3,4],[1.2701511529340699,2.4207354924039484]],
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
        [[4,3,1,2],[3.527521526842631, 2.836402651601924]]];

    for (var i = 0; i < testDataSet.length; i++) {
        var testData = testDataSet[i];
        var pos = geoPos.getPositionAtDistance(testData[0][0], testData[0][1], testData[0][2], testData[0][3], distance);
        var messagePrefix = "(" + testData[0][0] + ", " + testData[0][1] + ") => (" + testData[0][2] + ", " + testData[0][3] + "): ";
        assert.equal(pos.x.toFixed(NR_DIGITS), testData[1][0].toFixed(NR_DIGITS), messagePrefix + "x");
        assert.equal(pos.y.toFixed(NR_DIGITS), testData[1][1].toFixed(NR_DIGITS), messagePrefix + "y");
    }
});


QUnit.test("geoPos.calculateXSign", function(assert) {
	var geoPos = new GeoPosition();
    assert.equal(geoPos.calculateXSign(2, 1), -1, "2 => 1");
    assert.equal(geoPos.calculateXSign(1, 2), 1, "1 => 2");
    assert.equal(geoPos.calculateXSign(0, 0), 1, "0 => 0");
    assert.equal(geoPos.calculateXSign(-1, -2), -1, "-1 => -2");
    assert.equal(geoPos.calculateXSign(-2, -1), 1, "-2 => -1");
    assert.equal(geoPos.calculateXSign(1, -1), -1, "1 => -1");
    assert.equal(geoPos.calculateXSign(-1, 1), 1, "-1 => 1");
//     assert.equal(geoPos._private('calculateXSign')(179, -179), -1, "179 => -179");
//     assert.equal(geoPos._private('calculateXSign')(-179, 179), 1, "-179 => 179");
});


QUnit.test("geoPos.calculateYSign", function(assert) {
	var geoPos = new GeoPosition();
    assert.equal(geoPos.calculateYSign(2, 1), -1, "2 => 1");
    assert.equal(geoPos.calculateYSign(1, 2), 1, "1 => 2");
    assert.equal(geoPos.calculateYSign(0, 0), 1, "0 => 0");
    assert.equal(geoPos.calculateYSign(-1, -2), -1, "-1 => -2");
    assert.equal(geoPos.calculateYSign(-2, -1), 1, "-2 => -1");
    assert.equal(geoPos.calculateYSign(1, -1), -1, "1 => -1");
    assert.equal(geoPos.calculateYSign(-1, 1), 1, "-1 => 1");
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

    assert.equal(geoPos.speed, 0, "speed");
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

    assert.equal(geoPos.speed.toFixed(NR_DIGITS), 10.720129063617216.toFixed(NR_DIGITS), "speed");
    assert.equal(geoPos.speedX.toFixed(NR_DIGITS), -6.776960602240946.toFixed(NR_DIGITS), "speedX");
    assert.equal(geoPos.speedY.toFixed(NR_DIGITS), 8.306261020235553.toFixed(NR_DIGITS), "speedY");
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

    assert.equal(geoPos.speed.toFixed(NR_DIGITS), 5.360064531808608.toFixed(NR_DIGITS), "speed");
    assert.equal(geoPos.speedX.toFixed(NR_DIGITS), -3.388480301120473.toFixed(NR_DIGITS), "speedX");
    assert.equal(geoPos.speedY.toFixed(NR_DIGITS), 4.1531305101177765.toFixed(NR_DIGITS), "speedY");
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
    assert.equal(position.x.toFixed(NR_DIGITS), -3.388480301120473.toFixed(NR_DIGITS), "positionX");
    assert.equal(position.y.toFixed(NR_DIGITS), 4.1531305101177765.toFixed(NR_DIGITS), "positionY");
});


QUnit.test("geoPos.getFuturePosition unitialized", function(assert) {
	var geoPos = new GeoPosition();
    var pos = geoPos.getFuturePosition(17, 23, 3);

    assert.equal(pos.x.toFixed(NR_DIGITS), 17.0.toFixed(NR_DIGITS), "positionX");
    assert.equal(pos.y.toFixed(NR_DIGITS), 23.0.toFixed(NR_DIGITS), "positionY");
    assert.equal(pos.lastGeoLocation, undefined, "last geoLocation");
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

    assert.equal(pos.x.toFixed(NR_DIGITS), 17.0.toFixed(NR_DIGITS), "positionX");
    assert.equal(pos.y.toFixed(NR_DIGITS), 23.0.toFixed(NR_DIGITS), "positionY");
    assert.equal(pos.speed.toFixed(NR_DIGITS), 0.0.toFixed(NR_DIGITS), "speed");
    assert.equal(pos.lastGeoLocation.timestamp, 3, "last geoLocation timestamp");
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

    var hsp = geoPos.getFuturePosition(0, 0, 500, 500);
    assert.equal(hsp.x.toFixed(NR_DIGITS), -1.8134351099974304.toFixed(NR_DIGITS), "positionX");
    assert.equal(hsp.y.toFixed(NR_DIGITS), 5.043981055374935.toFixed(NR_DIGITS), "positionY");
});
