var Forest = (function () {
    "use strict";
    var pub = {};

    function createTholos() {
		var tholos = new THREE.Object3D();

        // add base
        var baseRadius = 30;
        var baseCenterX = 65;
        var baseCenterZ = 10;
        var tholosColor = 0xf0f0f0;
        var tholosBase = new THREE.Mesh(
            new THREE.CylinderGeometry(baseRadius, baseRadius, 5, 32),
            new THREE.MeshBasicMaterial({
                color: tholosColor
            })
        );
        tholosBase.translateX(baseCenterX);
        tholosBase.translateZ(baseCenterZ);
        tholos.add(tholosBase);

        // add pillars
        var pillarRadius = 2;
        var nrPillars = 12;
        var slice = 2 * Math.PI / nrPillars;
        for (var i = 0; i < nrPillars; i++) {
            var angle = slice * i;
            var x = baseCenterX + ((baseRadius - pillarRadius) * Math.cos(angle));
            var z = baseCenterZ + ((baseRadius - pillarRadius) * Math.sin(angle));
            var pillar = new THREE.Mesh(
                new THREE.CylinderGeometry(pillarRadius, pillarRadius, 80, 32),
                new THREE.MeshBasicMaterial({
                    color: tholosColor
                })
            );
            pillar.translateX(x);
            pillar.translateZ(z);
            tholos.add(pillar);
        }

        // add roof
        var tholosRoof = new THREE.Mesh(
            new THREE.CylinderGeometry(baseRadius, baseRadius, 5, 32),
            new THREE.MeshBasicMaterial({
                color: tholosColor
            })
        );
        tholosRoof.translateX(baseCenterX);
        tholosRoof.translateY(40);
        tholosRoof.translateZ(baseCenterZ);
        tholos.add(tholosRoof);

        var avoidMargin = 1.5;
		var avoidAreas = [new THREE.Box2(new THREE.Vector2(baseCenterX - (avoidMargin * baseRadius), baseCenterZ - (avoidMargin * baseRadius)),
            new THREE.Vector2(baseCenterX + (avoidMargin * baseRadius), baseCenterZ + (avoidMargin * baseRadius)))];

		return [tholos, avoidAreas];
    }


	function isInAvoidArea(xPos, zPos, avoidAreas) {
		for(var i = 0; i < avoidAreas.length; i++) {
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

        var trunkRadius = Math.random() * 5;
        var trunkHeight = Math.random() * 75;
        var treeTrunk = new THREE.Mesh(
            new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 32),
            new THREE.MeshBasicMaterial({
                color: 0x492a00
            })
        );
        treeTrunk.translateX(xPos);
        treeTrunk.translateZ(zPos);
        tree.add(treeTrunk);

        var treeHeadRadius = (trunkRadius * 2) + (Math.random() * 15);
        var treeHead = new THREE.Mesh(
            new THREE.SphereGeometry(treeHeadRadius, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0x2bcd00,
                opacity: 0.98,
                transparent: true
            })
        );
        treeHead.translateX(xPos);

        // the amount the treeHead sphere should sink into the trunk to match rim of the trunk with the sphere
        var treeHeadSink = treeHeadRadius - Math.sqrt(Math.pow(treeHeadRadius, 2) - Math.pow(trunkRadius, 2));

        treeHead.translateY((0.5 * trunkHeight) + (treeHeadRadius - treeHeadSink));
        treeHead.translateZ(zPos);
        tree.add(treeHead);
		return tree;
    }

    pub.createForest = function () {
		var forest = new THREE.Object3D();
		var tholosConstruction = createTholos();
		scene.add(tholosConstruction[0]);
		var avoidAreas = tholosConstruction[1];
        for (var i = 0; i < 50; i++) {
            forest.add(createTree(avoidAreas));
        }
		return forest;
    }


    return pub;
})();
