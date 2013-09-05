(function(root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else {
		root.SVGInliner = factory();
	}
}(this, function() {

	function request(URI, success) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', URI);
		xhr.onreadystatechange = function() {
			if (this.readyState !== 4) return;

			if (this.status === 200) {
				success(this);
			} else {
				console.log('SVGInliner HTTP error', this.status);
			}
		};
		xhr.send();
	}

	return function(selector) {
		var i, image, images = document.querySelectorAll(selector || 'img[src$=".svg"]');
		if (!images.length) return;

		for (i = 0; i < images.length; i++) {
			image = images[i];
			if (!image.src || !image.src.match(/\.svg$/)) return;

			request(image.src, function(xhr) {
				var svg = document.importNode(xhr.responseXML.firstChild);
				if (image.id) svg.id = image.id;
				svg.setAttribute('class', (image.className ? image.className : '') + ' inlined-svg');
				image.parentNode.replaceChild(svg, image);
			});
		}
	};
}));
