var postcss  = require('postcss'),
	prefixer = require('autoprefixer'),
	minifier = require('csswring'),
	vars     = require('postcss-vars'),
	rem      = require('pixrem'),
	mqpacker = require('css-mqpacker'),
	extend   = require('deep-extend');
var config,
	pipeline;

function Please (options) {

	var defaults = {
		autoprefixer: true,
		minifier: true,
		mqpacker: true,
		polyfills: {
			variables: true,
			rem: false
		}
	};
	config = extend(defaults, options);

}

Please.prototype.process = function (css) {

	var _options;

	pipeline = postcss();

	// prefixer
	if (_options = config.autoprefixer) {
		pipeline = usePlugin(prefixer, 'postcss', _options);
	}
	// minifier
	if (config.minifier) {
		pipeline = usePlugin(minifier, 'processor');
	}
	// mqpacker
	if (config.mqpacker) {
		pipeline = usePlugin(mqpacker, 'processor');
	}
	// polyfills
	if (_options = config.polyfills) {

		for(var polyfill in _options) {

			if (_options[polyfill] !== false) {

				switch (polyfill) {

					// variables
					case 'variables':
						pipeline = usePlugin(vars, 'processor');
						break;

					// rem
					case 'rem':
						pipeline = usePlugin(rem, 'postcss', _options[polyfill]);
						break;

				}

			}

		}

	}

	return pipeline.process(css).css;

};

function usePlugin (name, fn, options) {

	if (options === undefined) {
		return pipeline.use(name[fn]);
	} else if (options === true) {
		return pipeline.use(name()[fn]);
	} else {
		return pipeline.use(name.apply(null, options)[fn]);
	}

};


var please = function(options) {
	return new Please(options);
};
please.process = function(css, options) {
	return new Please(options).process(css);
};
module.exports = please;