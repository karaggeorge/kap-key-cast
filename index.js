'use strict';
const castKeys = require('macos-key-cast');
const hasPermissions = require('macos-accessibility-permissions');

const config = {
	size: {
		type: 'string',
		enum: ['Small', 'Normal', 'Large'],
		default: 'Normal',
		required: true
	},
	delay: {
		type: 'number',
		minimum: 0,
		default: 0.5,
		required: true
	},
	keyCombinationsOnly: {
		type: 'boolean',
		default: true
	},
	centerInCropper: {
		type: 'boolean',
		default: true
	}
};

const willStartRecording = async ({state, config, options: {screenId}}) => {
	if (!hasPermissions({ask: true})) {
		return;
	}

	const {size, delay, keyCombinationsOnly} = config.store;

	state.process = castKeys({
		display: screenId,
		size: size.toLowerCase(),
		delay,
		keyCombinationsOnly
	});
};

const didStopRecording = async ({state}) => {
	if (state.process) {
		state.process.cancel();
	}
};

const keysPressed = {
	title: 'Show keys pressed',
	config,
	willStartRecording,
	didStopRecording
};

exports.recordServices = [keysPressed];
