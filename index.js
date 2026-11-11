'use strict';
const castKeys = require('macos-key-cast');
const hasPermissions = require('macos-accessibility-permissions');

const assertPermissions = () => {
	if (!hasPermissions({ask: true})) {
		throw new Error('Kap needs Accessibility permissions to show pressed keys. Enable Kap in System Settings → Privacy & Security → Accessibility, then restart Kap.');
	}
};

const config = {
	size: {
		title: 'Size',
		description: 'Size of the UI.',
		type: 'string',
		enum: ['Small', 'Normal', 'Large'],
		default: 'Normal',
		required: true
	},
	delay: {
		title: 'Delay',
		description: 'How long the UI stays on screen.',
		type: 'number',
		minimum: 0,
		default: 0.5,
		required: true
	},
	keyCombinationsOnly: {
		title: 'Key Combinations Only',
		description: 'When enabled, the UI will only show for combinations with accelerators.',
		type: 'boolean',
		default: false
	},
	centerInCropper: {
		title: 'Center in Cropper',
		description: 'When enabled, the UI will use the cropper area to position. Otherwise it will use the whole screen.',
		type: 'boolean',
		default: true
	}
};

const willStartRecording = async ({state, config, apertureOptions: {screenId, cropArea}}) => {
	assertPermissions();

	const {size, delay, keyCombinationsOnly, centerInCropper} = config.store;

	state.process = castKeys({
		display: screenId,
		size: size.toLowerCase(),
		delay,
		keyCombinationsOnly,
		bounds: centerInCropper ? cropArea : undefined
	});
};

const didStopRecording = async ({state}) => {
	if (state.process) {
		state.process.cancel();
	}
};

const willEnable = () => {
	assertPermissions();
	return true;
};

const keysPressed = {
	title: 'Show Pressed Keys',
	config,
	willStartRecording,
	didStopRecording,
	willEnable
};

exports.recordServices = [keysPressed];
