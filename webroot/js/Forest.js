var Forest = (function () {
    "use strict";
    var api = {};
    var nrSegments = 32;

    function normal_random(mean, variance) {
        mean = mean || 0.0;
        variance = variance || 1.0;
        var V1, V2, S;
        do {
            var U1 = Math.random();
            var U2 = Math.random();
            V1 = 2 * U1 - 1;
            V2 = 2 * U2 - 1;
            S = V1 * V1 + V2 * V2;
        } while (S > 1);

        var X = Math.sqrt(-2 * Math.log(S) / S) * V1;
        //  Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
        X = mean + Math.sqrt(variance) * X;
        //  Y = mean + Math.sqrt(variance) * Y ;
        return X;
    }

    /*
     *  normRand: returns normally distributed random numbers
     */
    function normRand() {
        var x1, x2, rad;
        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            rad = x1 * x1 + x2 * x2;
        } while (rad >= 1 || rad === 0);
        var c = Math.sqrt(-2 * Math.log(rad) / rad);
        return x1 * c;
    }

    function subtract(varargs) {
		var mesh1 = new THREE.Mesh(arguments[0]);

        var resultBsp = new ThreeBSP(mesh1);
        for (var i = 1; i < arguments.length; i+= 2) {
            var mesh2 = new THREE.Mesh(arguments[i]);
            var translation = arguments[i + 1];
            mesh2.translateX(translation.x);
            mesh2.translateY(translation.y);
            mesh2.translateZ(translation.z);
            var bsp2 = new ThreeBSP(mesh2);

            resultBsp = resultBsp.subtract(bsp2);
        }
        return resultBsp;
    }


    /**
     * Creates a Tholos (round greek temple).
     * @return an array containing the create tholos as an THREE.Object3D and an array of THREE.vector2D of areas to avoid by trees and such.
     */
    function createTholos(areasToAvoid) {
        var tholos = new THREE.Object3D();

        // add base
        var baseRadius = 30;

        //        var material = new THREE.MeshBasicMaterial({color: 0xf0f0f0, shading:  THREE.FlatShading});
        var material = new THREE.MeshLambertMaterial({
            color: 0xf0f0f0,
            ambient: 0xf0f0f0,

        });
        //         var material = new THREE.MeshLambertMaterial({color: 0x7777ff});
        //var material = new THREE.MeshPhongMaterial( { ambient: 0xf0f0f0, color: 0xf0f0f0, specular: 0x000000, shininess: 1, shading: THREE.FlatShading } );

        var nrSteps = 3;
        var stepHeight = 2;
        var stepWidth = 2;
        for (var i = 0; i < nrSteps; i++) {
            var radius = baseRadius + (stepWidth * (nrSteps - i));
            var tholosBase = new THREE.Mesh(
                new THREE.CylinderGeometry(radius, radius, stepHeight, nrSegments),
                material
            );
            tholosBase.translateY((stepHeight * i) + (stepHeight * 0.5));
            tholos.add(tholosBase);
        }

        // add pillars
        var pillarRadius = 2;
        var nrPillars = 12;
        var slice = 2 * Math.PI / nrPillars;
        var pillarHeight = 40;
        for (var i = 0; i < nrPillars; i++) {
            var angle = slice * i;
            var x = (baseRadius - pillarRadius) * Math.cos(angle);
            var z = (baseRadius - pillarRadius) * Math.sin(angle);
            var pillar = new THREE.Mesh(
                new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 32),
                material
            );
            pillar.translateX(x);
            pillar.translateY(pillarHeight / 2);
            pillar.translateZ(z);
            tholos.add(pillar);
        }

        // add roof
        var roofBsp = subtract(new THREE.SphereGeometry(baseRadius, nrSegments, nrSegments),
                               new THREE.BoxGeometry(2 * baseRadius, 2* baseRadius, 2 * baseRadius),
                               new THREE.Vector3(0, -baseRadius, 0),
                               new THREE.CylinderGeometry(2 * pillarRadius, 2 * pillarRadius, 100, nrSegments),
                               new THREE.Vector3(0, 0, 0),
                               new THREE.SphereGeometry(baseRadius - (2 * pillarRadius), nrSegments, nrSegments),
                               new THREE.Vector3(0, 0, 0)
                              );

        var tholosRoof = roofBsp.toMesh(material);
		tholosRoof.geometry.computeVertexNormals();

        tholosRoof.translateY(40);
        tholos.add(tholosRoof);

        var tholosX = 65;
        var tholosZ = 40;

        tholos.translateX(tholosX);
        tholos.translateZ(tholosZ);

        var avoidMargin = 1.5;
        areasToAvoid.push(new THREE.Box2(new THREE.Vector2(tholosX - (avoidMargin * baseRadius), tholosZ - (avoidMargin * baseRadius)),
            new THREE.Vector2(tholosX + (avoidMargin * baseRadius), tholosZ + (avoidMargin * baseRadius))));

        return tholos;
    }

    function createTrunkColor() {
        var h = ((Math.random() * 10.0) + 40.0) / 360.0;
        var s = ((Math.random() * 10.0) + 90.0) / 100.0;
        var v = ((Math.random() * 15.0) + 15.0) / 100.0;

        var color = new THREE.Color();
        color.setHSL(h, s, v);
        return color.getHex();
    }

    function createLeafColor() {
        var h = 120.0 / 360.0;
        var s = ((Math.random() * 40) + 60) / 100.0;
        var v = ((Math.random() * 60)) / 100.0;

        var color = new THREE.Color();
        color.setHSL(h, s, v);
        return color.getHex();
    }


    function isInAvoidArea(xPos, zPos, avoidAreas) {
        for (var i = 0; i < avoidAreas.length; i++) {
            var avoidArea = avoidAreas[i];
            if (xPos > avoidArea.min.x && xPos < avoidArea.max.x && zPos > avoidArea.min.y && zPos < avoidArea.max.y) {
                return true;
            }
        }
        return false;
    }

    function createTree(avoidAreas) {
        var tree = new THREE.Object3D();

        var xPos = (Math.random() * 200) - 100; // between -100 and 100
        var zPos = (Math.random() * 200) - 100; // between -100 and 100
        while (isInAvoidArea(xPos, zPos, avoidAreas)) {
            xPos = (Math.random() * 200) - 100; // between -100 and 100
            zPos = (Math.random() * 200) - 100; // between -100 and 100
        }

        var maxTrunkRadius = 5;
        var trunkRadius = Math.random() * maxTrunkRadius;
        var trunkHeight = (4 * trunkRadius) + (Math.random() * (40 - (4 * maxTrunkRadius)));
        var trunkMaterial = new THREE.MeshLambertMaterial({
            color: createTrunkColor(),
            ambient: createTrunkColor()
        });
        var treeTrunk = new THREE.Mesh(
            new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 32),
            trunkMaterial
        );
        treeTrunk.translateX(xPos);
        treeTrunk.translateY(trunkHeight / 2);
        treeTrunk.translateZ(zPos);
        tree.add(treeTrunk);

        var treeCrownRadius = (trunkHeight + normRand()) / 2;
        var leafMaterial = new THREE.MeshLambertMaterial({
            color: createLeafColor(),
            ambient: createLeafColor(),
            opacity: 0.98,
            transparent: true
        })
        var treeCrown = new THREE.Mesh(
            new THREE.SphereGeometry(treeCrownRadius, 32, 32),
            leafMaterial
        );
        treeCrown.translateX(xPos);

        // the amount the treeCrown sphere should sink into the trunk to match rim of the trunk with the sphere
        var treeCrownSink = treeCrownRadius - Math.sqrt(Math.pow(treeCrownRadius, 2) - Math.pow(trunkRadius, 2));

        treeCrown.translateY(trunkHeight + (treeCrownRadius - treeCrownSink));
        treeCrown.translateZ(zPos);
        tree.add(treeCrown);
        return tree;
    }

    api.createForest = function () {
        var forest = new THREE.Object3D();
        var areasToAvoid = [];
        forest.add(createTholos(areasToAvoid));
        for (var i = 0; i < 50; i++) {
            forest.add(createTree(areasToAvoid));
        }
        forest.castShadow = true;
        forest.receiveShadow = true;
        return forest;
    }

    return api;
})();
