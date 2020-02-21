'use strict';
const castKeys = require('macos-key-cast');
const hasPermissions = require('macos-accessibility-permissions');

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
		default: true
	},
	centerInCropper: {
		title: 'Center in cropper',
		description: 'When enabled, the UI will use the cropper area to position. Otherwise it will use the whole screen.',
		type: 'boolean',
		default: true
	}
};

const willStartRecording = async ({state, config, apertureOptions: {screenId, cropArea}}) => {
	if (!hasPermissions({ask: true})) {
		return;
	}

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
	return hasPermissions({ask: true});
}

const keysPressed = {
	title: 'Show Keys Pressed',
	config,
	willStartRecording,
	didStopRecording,
	willEnable
};

exports.recordServices = [keysPressed];
