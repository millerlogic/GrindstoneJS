/**
 * Wrap the outer structure of the set of elements
 * @param {string} structure - HTML structure, opening tags only
 * @returns {object} current instance of Grindstone
 */

	$.fn.wrap = function(structure) {
		this.each(function() {
			if (typeof structure === 'string') {
				var contents = this.outerHTML;
				var wrap = structure;
				this.outerHTML = wrap + contents;
			} else {
				throw new Error('wrap() structure must be a string.');
			}
		});
		return this;
	};

/**
 * Wrap the inner structure of the set of elements
 * @param {string} structure - HTML structure, opening tags only
 * @returns {object} current instance of Grindstone
 */
	
	$.fn.wrapInner = function(structure) {
		this.each(function() {
			if (typeof structure === 'string') {
				var contents = $(this).html();
				var wrap = structure;
				$(this).html(wrap + contents);
			} else {
				throw new Error('wrapInner() structure must be a string.');
			}
		});
		return this;
	};
 