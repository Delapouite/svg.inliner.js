(function(root, factory) {
	// UMD boileplate
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else {
		root.SVGInliner = factory();
	}
}(this, function() {
	'use strict';

	// XHR helper
	function request(URI, success) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', URI);
		xhr.onreadystatechange = function() {
			if (this.readyState !== XMLHttpRequest.DONE) return;

			if (this.status === 200) {
				success(this);
			} else {
				console.log('SVGInliner HTTP error', this.status);
			}
		};
		xhr.send();
	}

	return function(selector, next) {
		var i,
			svgs = [],
			images = document.querySelectorAll(selector || 'img[src$=".svg"]'),
			length = images.length,
			replacements = 0;

		// error, no images found
		if (!length) {
			if (next)
				next('No images found');

			return;
		}

		for (i = 0; i < length; i++) {
			(function(image) {
				// error, not a svg
				if (!image.src || !image.src.match(/\.svg$/))
					return replacements++;

				request(image.src, function(xhr) {
					var svg = document.importNode(xhr.responseXML.firstChild, true);

					// keep original ID and CSS classes
					if (image.id) svg.id = image.id;
					svg.setAttribute('class', (image.className ? image.className : '') + ' inlined-svg');
					image.parentNode.replaceChild(svg, image);

					svgs.push(svg);
					replacements++;
					// trigger callback if provided with svgs
					if (next && replacements === length)
						next(null, svgs);

				});
			})(images[i]);
		}
	};
}));
