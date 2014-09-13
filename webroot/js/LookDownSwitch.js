/**
 * A switch that is activated by the user looking straight down.
 * It has a highlight area where the switch becomes visible, and a smaller 'trigger' area where
 * the switch is actually triggered.
 * Tech notes:
 * The switch maintains 2 states: the display state and the switchState.
 * The display state determines whether to show the highlight and which button color to display.
 * This state is for internal use only.
 * The button state determines the external state, wether the button is switch on or off for instance.
 */
var LookDownSwitch = (function () {
    "use strict";
    var api = {};

    var DisplayState = {
        NONE: 1,
        HIGHLIGHT: 2,
        TRIGGER: 3
    };

    var buttonMainGroup;
    var currentDisplayState = DisplayState.NONE;
    var highlight;
    var camera;
    var buttonStates = [];
    var currentButtonState = 0;
    var buttonRadius = 10;
    var highlightAngle = 25;
    var triggerAngle = 15;

    var createHighLight = function () {
        var highlight = new THREE.Object3D();

        // outer ring
        highlight.add(new THREE.Mesh(
            new THREE.CylinderGeometry(5.2, 5.2, 0.8, 32),
            new THREE.MeshBasicMaterial({
                color: 0x000000
            })
        ));
        // inner highlight
        highlight.add(new THREE.Mesh(
            new THREE.CylinderGeometry(5.0, 5.0, 1.2, 32),
            new THREE.MeshBasicMaterial({
                color: 0xffff00
            })
        ));

        // inner ring
        highlight.add(new THREE.Mesh(
            new THREE.CylinderGeometry(4.1, 4.1, 1.4, 32),
            new THREE.MeshBasicMaterial({
                color: 0x000000
            })
        ));

        return highlight;
    };

    var createOnButton = function () {
        return createButton(0x0000ff);
    };

    var createOffButton = function () {
        return createButton(0xff0000);
    };

    var createButton = function (buttonColor) {
        var geometry = new THREE.CylinderGeometry(3, 3, 4, 32);
        var material = new THREE.MeshBasicMaterial({
            color: buttonColor
        });
        var cylinder = new THREE.Mesh(geometry, material);
        return cylinder;
    }

    var determineDisplayState = function (orientationData) {
        if ((Math.abs(orientationData.beta) <= triggerAngle) && (Math.abs(orientationData.gamma) <= triggerAngle)) {
            return DisplayState.TRIGGER;
        } else if ((Math.abs(orientationData.beta) <= highlightAngle) && (Math.abs(orientationData.gamma) <= highlightAngle)) {
            return DisplayState.HIGHLIGHT;
        }

        return DisplayState.NONE;
    };

    var updateState = function (eventData) {
        var newState = determineDisplayState(eventData);
        if (newState === currentDisplayState) {
            return;
        }
        setState(newState);
    }


    var setState = function (newState) {
        currentDisplayState = newState;
        // remove highlight + button
        if (currentDisplayState === DisplayState.NONE) {
            buttonMainGroup.remove(highlight);
            buttonMainGroup.remove(buttonStates[currentButtonState].button);
        } else if (currentDisplayState === DisplayState.HIGHLIGHT) {
            buttonMainGroup.add(highlight);
            buttonMainGroup.add(buttonStates[currentButtonState].button);
            highlight.position.x = camera.position.x;
            highlight.position.z = camera.position.z;
            buttonStates[currentButtonState].button.position.x = camera.position.x;
            buttonStates[currentButtonState].button.position.z = camera.position.z;
        } else if (currentDisplayState === DisplayState.TRIGGER) {
            buttonMainGroup.add(highlight);
            buttonMainGroup.remove(buttonStates[currentButtonState].button);
            if (++currentButtonState >= buttonStates.length) {
                currentButtonState = 0;
            }
            var buttonState = buttonStates[currentButtonState]
            buttonMainGroup.add(buttonState.button);
            highlight.position.x = camera.position.x;
            highlight.position.z = camera.position.z;
            buttonStates[currentButtonState].button.position.x = camera.position.x;
            buttonStates[currentButtonState].button.position.z = camera.position.z;
            buttonState.callback();
        }
    }


    function handleDeviceOrientation(eventData) {
        updateState(eventData);
    }


    api.create = function (theScene, theCamera, theButtonStates) {
        if (window.DeviceOrientationEvent) {
            console.log("DeviceOrientation is supported");
        } else {
            console.log("DeviceOrientation is not supported");
        }
        if (window.DeviceOrientationEvent) {
            // Listen for the event and handle DeviceOrientationEvent object
            window.addEventListener('deviceorientation', handleDeviceOrientation, false);
        }

        camera = theCamera;
        buttonStates = theButtonStates;
        for (var i = 0; i < buttonStates.length; i++) {
            var buttonState = buttonStates[i];
            buttonState.button = createButton(buttonState.buttonColor);
        }
        highlight = createHighLight();

        buttonMainGroup = new THREE.Object3D();
        currentButtonState = 0;
        buttonMainGroup.add(buttonStates[currentButtonState].button);
        theScene.add(buttonMainGroup);
        setState(DisplayState.TRIGGER);
    };

    return api;
})();
