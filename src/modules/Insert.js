
	priv.insert = function(set, position, content) {
		if (typeof content === 'string') {
			if (content.match(/(<).+(>)/)) {
				set.each(function() {
					this.insertAdjacentHTML(position, content);
				});
			} else {
				set.each(function() {
					this.insertAdjacentText(position, content);
				});
			}
		} else {
			// NOTE: this fails if you attempt to insert a text node!
			var elements = content instanceof Array ? content : $(content);
			var i = -1, len = set.length;
			set.each(function() {
				i++;
				if (i == len - 1) {
					// Append elements directly if last.
					for (var j = 0; j < elements.length; j++) {
						this.insertAdjacentElement(position, elements[j]);
					}
				} else {
					// Append cloned elements for all but the last.
					for (var j = 0; j < elements.length; j++) {
						this.insertAdjacentElement(position, elements[j].cloneNode(true));
					}
				}
			});
		}
		return set;
	};

/**
 * Insert new content before a target element
 * @param {string|object} content
 * @returns {object} current instance of Grindstone
 */

	$.fn.before = function(content) {
		return priv.insert(this, 'beforebegin', content);
	};

/**
 * Insert new content after a target element
 * @param {string|object} content
 * @returns {object} current instance of Grindstone
 */

	$.fn.after = function(content) {
		return priv.insert(this, 'afterend', content);
	};

/**
 * Append child elements to the current object
 * @param {string|object} content
 * @returns {object} current instance of Grindstone
 */

	$.fn.append = function(content) {
		return priv.insert(this, 'beforeend', content);
	};

/**
 * Prepend a new element or new content
 * @param {string|object} content
 * @returns {object} current instance of Grindstone
 */

	$.fn.prepend = function(content) {
		return priv.insert(this, 'afterbegin', content);
	};

