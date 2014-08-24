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
var LookDownSwitch = (function() {
	var public = {};
	
	var DisplayState = {
		NONE: 1,
		HIGHLIGHT: 2,
		TRIGGER: 3
	};


	var buttonStates = [
		{
			buttonColor: 0xff0000,
			callback: new function() {
				console.log('stand');
			}
		},
		{
			buttonColor: 0x0000ff,
			callback: new function() {
				console.log('walk');
			}
		}
	];

	var currentButtonState = 0;
	var buttonRadius = 10;
	var highlightAngle = 25;
	var triggerAngle = 15;

	var createHighLight = function() {
		var highlight = new THREE.Object3D();
	
		// outer ring
		highlight.add(new THREE.Mesh(
						new THREE.CylinderGeometry(5.2, 5.2, 0.8, 32 ),
						new THREE.MeshBasicMaterial( {color: 0x000000})
					));
		// inner highlight
		highlight.add(new THREE.Mesh(
						new THREE.CylinderGeometry(5.0, 5.0, 1.2, 32 ),
						new THREE.MeshBasicMaterial( {color: 0xffff00})
					));

		// inner ring
		highlight.add(new THREE.Mesh(
						new THREE.CylinderGeometry(4.1, 4.1, 1.4, 32 ),
						new THREE.MeshBasicMaterial( {color: 0x000000})
					));

		return highlight;
	};

	var createOnButton = function() {
		return createButton(0x0000ff);
	};

	var createOffButton = function() {
		return createButton(0xff0000);
	};

	var createButton = function(buttonColor) {
		var geometry = new THREE.CylinderGeometry(3, 3, 4, 32 );
		var material = new THREE.MeshBasicMaterial( {color: buttonColor} );
		var cylinder = new THREE.Mesh( geometry, material );
		return cylinder;
	}

	var determineDisplayState = function(orientationData) {
		if ((Math.abs(orientationData.beta) <= triggerAngle)
		 && (Math.abs(orientationData.gamma) <= triggerAngle)) {
			return DisplayState.TRIGGER;
		} else if ((Math.abs(orientationData.beta) <= highlightAngle)
			 && (Math.abs(orientationData.gamma) <= highlightAngle)) {
			return DisplayState.HIGHLIGHT;
		}
		
		return DisplayState.NONE;
	};

	var updateState = function(eventData) {
		var newState = determineDisplayState(eventData);
		if (newState === this.currentDisplayState) {
			return;
		}
		setState(newState);
	}

	
	var setState = function(newState) {
		this.currentDisplayState = newState;
		// remove highlight + button
		if (this.currentDisplayState === DisplayState.NONE) {
			this.scene.remove(highlight);
			this.scene.remove(buttonStates[currentButtonState].button);
		} else if (this.currentDisplayState === DisplayState.HIGHLIGHT) {
			console.log("highlight button state:" + currentButtonState);
			this.scene.add(highlight);
			this.scene.add(buttonStates[currentButtonState].button);
		} else if (this.currentDisplayState === DisplayState.TRIGGER) {
			this.scene.add(highlight);
			console.log("old button state:" + currentButtonState);
			this.scene.remove(buttonStates[currentButtonState].button);
			if (++currentButtonState >= buttonStates.length) {
				currentButtonState = 0;
			}
			console.log("new button state:" + currentButtonState);
			console.log("new button color:" + buttonStates[currentButtonState].buttonColor);
			this.scene.add(buttonStates[currentButtonState].button);
		}
	}

	var currentDisplayState = DisplayState.NONE;
	var scene = null;
	var highlight;
	
	public.create = function(scene) {
		if (window.DeviceOrientationEvent) {
			console.log("DeviceOrientation is supported");
		} else {
			console.log("DeviceOrientation is not supported");
		}
		if (window.DeviceOrientationEvent) {
			// Listen for the event and handle DeviceOrientationEvent object
			function handleDeviceOrientation(eventData) {
				updateState(eventData);
			}
			window.addEventListener('deviceorientation', handleDeviceOrientation, false);
		}
		
		for (var i = 0; i < buttonStates.length; i++) {
			var buttonState = buttonStates[i];
			buttonState.button = createButton(buttonState.buttonColor);
		}
		highlight = createHighLight();

		this.scene = scene;
		currentButtonState = 0;
		this.scene.add(buttonStates[currentButtonState].button);
		setState(DisplayState.TRIGGER);
	};

	return public;
})();
