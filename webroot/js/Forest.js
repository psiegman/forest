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

    function createSign(areasToAvoid) {
        var sign = new THREE.Object3D();
        var board = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 10, 10),
            new THREE.MeshLambertMaterial({
                color: 0xd2a95a,
                ambient: 0xd2a95a
            })
        );
        //        board.translateX(0);
        board.translateZ(2);
        sign.add(board);

        var material = new THREE.MeshLambertMaterial({
            color: 0x000000,
            ambient: 0x000000
        });

        var nrSegments = 32;

        var arrowLine = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 4, nrSegments),
            material);
        arrowLine.translateY(1);
        sign.add(arrowLine);

        var arrowHead = new THREE.Mesh(
            new THREE.CylinderGeometry(1.5, 0, 3, nrSegments),
            material)
        arrowHead.translateY(-2);
        sign.add(arrowHead);

        var head = new THREE.Mesh(
            new THREE.SphereGeometry(1, nrSegments, nrSegments),
            material)
        head.translateY(2.3);
        head.translateZ(4.1);
        sign.add(head);

        var spine = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 2.6, nrSegments),
            material)
        spine.translateY(0.4);
        spine.translateZ(3.7);
        spine.rotation.x = 0.2;
        sign.add(spine);

        var leg1Upper = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.5, nrSegments),
            material)
        leg1Upper.translateY(-1.3);
        leg1Upper.translateZ(3.9);
        leg1Upper.rotation.x = -0.8;
        sign.add(leg1Upper);

        var leg1Lower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.5, nrSegments),
            material)
        leg1Lower.translateY(-2.5);
        leg1Lower.translateZ(4.5);
        leg1Lower.rotation.x = -0.1;
        sign.add(leg1Lower);

        var foot1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1, nrSegments),
            material)
        foot1.translateY(-3.4);
        foot1.translateZ(4.9);
        foot1.rotation.x = -1.4;
        sign.add(foot1);

        var leg2Upper = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.5, nrSegments),
            material)
        leg2Upper.translateY(-1.6);
        leg2Upper.translateZ(3.2);
        leg2Upper.rotation.x = 0.2;
        sign.add(leg2Upper);

        var leg2Lower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.5, nrSegments),
            material)
        leg2Lower.translateY(-2.9);
        leg2Lower.translateZ(2.6);
        leg2Lower.rotation.x = 0.6;
        sign.add(leg2Lower);

        var foot2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1, nrSegments),
            material)
        foot2.translateY(-3.5);
        foot2.translateZ(2.7);
        foot2.rotation.x = -1.4;
        sign.add(foot2);

        var arm1Upper = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.3, nrSegments),
            material)
        arm1Upper.translateY(0.3);
        arm1Upper.translateZ(4.4);
        arm1Upper.rotation.x = -1.2;
        sign.add(arm1Upper);

        var arm1Lower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.3, nrSegments),
            material)
        arm1Lower.translateY(0.2);
        arm1Lower.translateZ(5.5);
        arm1Lower.rotation.x = -1.8;
        sign.add(arm1Lower);

        var arm2Upper = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.3, nrSegments),
            material)
        arm2Upper.translateY(0.3);
        arm2Upper.translateZ(3.0);
        arm2Upper.rotation.x = -1.8;
        sign.add(arm2Upper);

        var arm2Lower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 1.3, nrSegments),
            material)
        arm2Lower.translateY(-0.3);
        arm2Lower.translateZ(2.3);
        arm2Lower.rotation.x = -2.8;
        sign.add(arm2Lower);

        sign.translateX(10);
        sign.translateY(10);
        sign.translateZ(0);

        var avoidMargin = 1.5;
        areasToAvoid.push(new THREE.Box2(new THREE.Vector2(0, 15),
            new THREE.Vector2(0, 15)));

        return sign;
    }

    function createSignCanvas() {
        // create a canvas element
        var canvas1 = document.createElement('canvas');
        var ctx = canvas1.getContext('2d');
        ctx.font = "Bold 32px Arial";
        ctx.fillStyle = "rgba(255,0,0,1)";
        ctx.strokeStyle = "rgba(255,0,0,1)";
        ctx.fillText("\u2b07", 20, 40);

        ctx.beginPath();
        ctx.arc(71, 28, 8, 0, 2 * Math.PI);
        ctx.moveTo(70, 35);
        ctx.lineTo(65, 70);

        // leg 1
        ctx.lineTo(70, 85);
        ctx.lineTo(70, 100);
        ctx.lineTo(78, 97);

        // leg 2
        ctx.moveTo(64, 70);
        ctx.lineTo(60, 85);
        ctx.lineTo(50, 95);
        ctx.lineTo(55, 103);

        // arm 1
        ctx.moveTo(69, 47);
        ctx.lineTo(77, 59);
        ctx.lineTo(83, 52);

        // arm 2
        ctx.moveTo(69, 47);
        ctx.lineTo(57, 52);
        ctx.lineTo(53, 55);

        ctx.stroke();

        // canvas contents will be used for a texture
        var texture1 = new THREE.Texture(canvas1)
        texture1.needsUpdate = true;

        var material1 = new THREE.MeshBasicMaterial({
            map: texture1,
            side: THREE.DoubleSide
        });
        material1.transparent = false;

        var mesh1 = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            material1
        );
        mesh1.position.set(10, 10, 0);
        mesh1.rotation.y = -Math.PI / 2;
        return mesh1;
    }

    /**
     * Subtracts one or more THREE.Geometries from a source THREE.Geometry.
     *
     * Expects a list of arguments as follows:
     * arguments[0]: the source THREE.Geometry
     * arguments[i]: a THREE.Geometry that will be subtracted from the source geometry
     * arguments[i+1]: a THREE.Vector3 that will be used to translate the subtract mesh before the subtract operation
     *
     * @return a ThreeBSP.node
     */
    function subtract(varargs) {
        var mesh1 = new THREE.Mesh(arguments[0]);

        var resultBsp = new ThreeBSP(mesh1);
        for (var i = 1; i < arguments.length; i += 2) {
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
        var material = new THREE.MeshPhongMaterial({
            color: 0xf0f0f0,
            ambient: 0xc0c0f0,
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
            new THREE.BoxGeometry(2 * baseRadius, 2 * baseRadius, 2 * baseRadius),
            new THREE.Vector3(0, -baseRadius, 0),
            new THREE.CylinderGeometry(2 * pillarRadius, 2 * pillarRadius, baseRadius * 200, nrSegments),
            new THREE.Vector3(0, baseRadius, 0),
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

        var forestWidth = 400;
        var forestBreadth = 400;

        var xPos = (Math.random() * forestWidth) - (forestWidth / 2);
        var zPos = (Math.random() * forestBreadth) - (forestBreadth / 2);
        while (isInAvoidArea(xPos, zPos, avoidAreas)) {
            xPos = (Math.random() * forestWidth) - (forestWidth / 2);
            zPos = (Math.random() * forestBreadth) - (forestBreadth / 2);
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
        forest.add(createSign(areasToAvoid));
        for (var i = 0; i < 200; i++) {
            forest.add(createTree(areasToAvoid));
        }
        forest.castShadow = true;
        forest.receiveShadow = true;
        return forest;
    }

    return api;
})();
