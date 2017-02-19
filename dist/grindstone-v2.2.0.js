/**
 * Grindstone JavaScript Library v2.2.0
 * https://github.com/dzervoudakes/GrindstoneJS
 * 
 * Copyright (c) 2014, 2017 Dan Zervoudakes
 * Released under the MIT license
 * https://github.com/dzervoudakes/GrindstoneJS/blob/master/LICENSE
 */

(function(w, d) {

'use strict';

/**
 * Library core: constructor, prototype
 * @param {string|object} selector
 * @param {string|object} context - optional
 * @returns {object} Grindstone
 */
	
	var Grindstone = function(selector, context) {
		var set = this;
		if (selector) {
			var ctx, elems;
			if (typeof selector === 'string') {
				if (context) {
					if (typeof context === 'string') {
						ctx = d.querySelectorAll(context);
					} else if(priv.isElementArray(context)) {
						ctx = context;
					} else {
						ctx = [context];
					}
					Array.prototype.forEach.call(ctx, function(item) {
						elems = item.querySelectorAll(selector);
						Array.prototype.forEach.call(elems, function(el) {
							if (set.indexOf(el) === -1) {
								set.push(el);
							}
						});
					});
				} else {
					set.push.apply(set, d.querySelectorAll(selector));
				}
			} else if (priv.isElementArray(selector)) {
				set.push.apply(set, selector);
			} else {
				set.push(selector);
			}
		}
		this.set = set; // Backwards compatibility.
		return this;
	};

	Grindstone.prototype = [];
	
	var $ = function(selector, context) {
		return new Grindstone(selector, context);
	};
	
	$.fn = Grindstone.prototype;

	// private functions
	var priv = {};
	
	priv.prop = function(obj, property) {
		return obj.hasOwnProperty(property);
	};
	
	priv.createInteraction = function(touchEvt, mouseEvt) {
		return 'ontouchend' in d ? touchEvt : mouseEvt;
	};

	// This also returns true for Grindstone objects.
	priv.isElementArray = function(obj) {
		return obj instanceof Array
	};

	priv.matchesFuncName = Element.prototype.matches ? 'matches' :
		Element.prototype.matchesSelector ? 'matchesSelector' :
		Element.prototype.webkitMatchesSelector ? 'webkitMatchesSelector' :
		Element.prototype.mozMatchesSelector ? 'mozMatchesSelector' :
		Element.prototype.msMatchesSelector ? 'msMatchesSelector' :
		undefined;

/**
 * Submit a GET or POST AJAX request
 * @param {object} - { properties => values }
 * @returns {object} xmlhttp
 * 
 * Acceptable properties of "opts" are:
 * - method (GET or POST)
 * - url (data path)
 * - async (true or false)
 * - success (callback to invoke if successful)
 * - error (callback to invoke if unsuccessful)
 * - header (adds a custom HTTP header to the request)
 * - headerValue (value of the custom HTTP header)
 */

	$.ajax = function(opts) {
		
		var method, url, async, success, error, header, headerValue, xmlhttp;
		
		if (typeof opts === 'object') {
			method   = priv.prop(opts, 'method')   ? opts.method   : null;
			url      = priv.prop(opts, 'url')      ? opts.url      : null;
			async    = priv.prop(opts, 'async')    ? opts.async    : true;
			success  = priv.prop(opts, 'success')  ? opts.success  : null;
			error    = priv.prop(opts, 'error')	   ? opts.error	   : function(){};
		} else {
			throw new Error('XHR properties are not properly defined.');
		}
		
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					success(xmlhttp);
				} else {
					error(xmlhttp);
				}
			}
		};
		xmlhttp.open(method, url, async);
		
		if (priv.prop(opts, 'header') && priv.prop(opts, 'headerValue')) {
			xmlhttp.setRequestHeader(header, headerValue);
		} else {
			xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		}
		
		xmlhttp.send(null);
		
		return xmlhttp;
	};

/**
 * Set or return the value of the specified attribute
 * @param {string} attribute
 * @param {string} value - optional
 * @returns {object|string} current instance of Grindstone or attribute value
 */

	$.fn.attr = function(attribute, value) {
		var elemAttribute;
		this.each(function() {
			if (value || value === '') {
				this.setAttribute(attribute, value);
			} else {
				elemAttribute = this.getAttribute(attribute);
			}
		});
		return value ? this : elemAttribute;
	};

/**
 * Determine if the current element has the specified attribute
 * @param {string} attribute
 * @returns {boolean} true or false
 */

	$.fn.hasAttr = function(attribute) {
		var exists;
		this.each(function() {
			if (attribute) exists = $(this).attr(attribute) !== null;
		});
		return exists;
	};

/**
 * Remove the the specified attribute
 * @param {string} attribute
 * @returns {object} current instance of Grindstone
 */

	$.fn.removeAttr = function(attribute) {
		this.each(function() {
			if (attribute) this.removeAttribute(attribute);
		});
		return this;
	};

/**
 * Adjust the styles of selected elements or return the requested value
 * @param {object|string} styles - style properties
 * @param {string} value - style value
 * @returns {object|string} current instance of Grindstone or style value
 */

	$.fn.css = function(styles, value) {
		var returnedStyle, returnStyle;
		this.each(function() {
			if (typeof styles === 'object') {
				var self = this;
				var stl = Object.keys(styles);
				stl.forEach(function(key) {
					self.style[key] = styles[key];
				});
			} else if (typeof styles === 'string' && (value === undefined || value === null)) {
				returnedStyle = this.style[styles];
				returnStyle = true;
			} else if (typeof styles === 'string') {
				this.style[styles] = value;
			}
		});
		return returnStyle ? returnedStyle : this;
	};

/**
 * Determine if the elements have the specified class
 * @param {string} cls - className
 * @returns {boolean} true or false
 */

	$.fn.hasClass = function(cls) {
		var hasCls;
		this.each(function() {
			hasCls = this.classList.contains(cls);
		});
		return hasCls;
	};

/**
 * Add a class to the current set of elements
 * @param {string} cls - className
 * @returns {object} current instance of Grindstone
 */

	$.fn.addClass = function(cls) {
		var classes = cls.split(' ');
		this.each(function() {
			var self = this;
			classes.forEach(function(clsName) {
				self.classList.add(clsName);
			});
		});
		return this;
	};

/**
 * Remove a class from the current set of elements
 * @param {string} cls - className
 * @returns {object} current instance of Grindstone
 */

	$.fn.removeClass = function(cls) {
		var classes = cls.split(' ');
		this.each(function() {
			var self = this;
			classes.forEach(function(clsName) {
				self.classList.remove(clsName);
			});
		});
		return this;
	};

/**
 * Toggle the specified class
 * @param {string} cls - className
 * @returns {object} current instance of Grindstone
 */

	$.fn.toggleClass = function(cls) {
		var classes = cls.split(' ');
		this.each(function() {
			var self = this;
			classes.forEach(function(clsName) {
				self.classList.toggle(clsName);
			});
		});
		return this;
	};

/**
 * Clone the elements in the set
 * @returns {object} the cloned elements as a new instance of Grindstone
 */
 
	$.fn.clone = function() {
		return this.map(function() {
			return this.cloneNode(true);
		});
	};

/**
 * Assign a data-value to a set of elements or return the current value of an element
 * @param {string} valueName - data property
 * @param {string} valueContent - new value, optional
 * @returns {object|number} current instance of Grindstone or the current data-value of an element
 */

	$.fn.data = function(valueName, valueContent) {
		if (valueContent) {
			this.each(function() {
				$(this).attr('data-' + valueName, valueContent);
			});
			return this;
		} else {
			var elemValue;
			this.each(function() {
				elemValue = $(this).attr('data-' + valueName);
			});
			return elemValue;
		}
	};

/**
 * Remove a data-value from a set of elements
 * @param {string} valueName - data property
 * @returns {object} current instance of Grindstone
 */

	$.fn.removeData = function(valueName) {
		this.each(function() {
			$(this).removeAttr('data-' + valueName);
		});
		return this;
	};

/**
 * Debounce a given function
 * @param {function} fn - function to debounce
 * @param {number} wait - wait time in milliseconds
 * @param {boolean} immediate - invoke immediately?
 * @returns {function} invoke debounce
 */

	$.debounce = function(fn, wait, immediate) {
	    var timeout;
	    var debounce = function() {
	        var context = this;
	        var args = arguments;
	        var later = function() {
	            timeout = null;
	            if (!immediate) fn.apply(context, args);
	        };
	        var callNow = immediate && !timeout;
	        clearTimeout(timeout);
	        timeout = setTimeout(later, wait);
	        if (callNow) fn.apply(context, args);
	    };
	    return debounce;
	};

/**
 * Adjust the height of the selected elements or return the current height value of the first element in the set
 * @param {number} num - new height in px, optional
 * @returns {object|number} current instance of Grindstone or current height of the first element
 */

	$.fn.height = function(num) {
		if (typeof num === 'number' || num === 0) {
			this.each(function() {
				this.style.height = num + 'px';
			});
			return this;
		} else {
			var self = this.set[0];
			if (self === d) {
				return d.body.clientHeight;
			} else if (self === w) {
				return w.innerHeight;
			} else {
				return this.set[0].offsetHeight;
			}
		}
	};

/**
 * Adjust the width of the selected elements or return the current width value of the first element in the set
 * @param {number} num - new width in px, optional
 * @returns {object|number} current instance of Grindstone or current width of the first element in the set
 */

	$.fn.width = function(num) {
		if (typeof num === 'number' || num === 0) {
			this.each(function() {
				this.style.width = num + 'px';
			});
			return this;
		} else {
			var self = this.set[0];
			if (self === d) {
				return d.body.clientWidth;
			} else if (self === w) {
				return w.innerWidth;
			} else {
				return this.set[0].offsetWidth;
			}
		}
	};

/**
 * Show a set of hidden elements
 * @param {delay} delay - in milliseconds, optional
 * @returns {object} current instance of Grindstone
 */

	$.fn.show = function(delay) {
		if (delay) {
			var self = this;
			setTimeout(function() {
				$.fn.show.call(self);
			}, delay);
		} else {
			this.each(function() {
				if (this.style.display === 'none') {
					this.style.display = $(this).data('_prevdisplay') || '';
					$(this).removeData('_prevdisplay');
				}
			});
		}
		return this;
	};

/**
 * Hide a set of elements
 * @param {delay} delay - in milliseconds, optional
 * @returns {object} current instance of Grindstone
 */

	$.fn.hide = function(delay) {
		if (delay) {
			var self = this;
			setTimeout(function() {
				$.fn.hide.call(self);
			}, delay);
		} else {
			this.each(function() {
				if (this.style.display !== 'none') {
					if (this.style.display) {
						$(this).data('_prevdisplay', this.style.display);
					}
					this.style.display = 'none';
				}
			});
		}
		return this;
	};

/**
 * Trigger a function by double-tapping or double-clicking
 * @param {function} callback
 * @returns {object} current instance of Grindstone
 */

	$.fn.doubleTap = function(callback) {
		var active, interaction;
		this.each(function() {
			active = false;
			interaction = 'ontouchend' in d ? 'touchend' : 'click';
			$(this).on(interaction, function() {
				if (active) {
					callback();
					return active = false;
				}
				active = true;
				setTimeout(function() {
					return active = false;
				}, 350);
			});
		});
		return this;
	};

/**
 * Iterate through each item in the set and execute the callback
 * @param {function} callback
 * @returns {object} current instance of Grindstone
 */
	
	$.fn.each = function(callback) {
		var set = this.set;
		set = Array.prototype.slice.call(set);
		set.forEach(function(item) {
			callback.call(item);
		});
		return this;
	};
 
/**
 * Return the DOM element at the specified index of the current as a new instance of Grindstone
 * @param {number} index
 * @returns {object} new instance of Grindstone specific to one element
 */

	$.fn.eq = function(index) {
		return $(this.set[index]);
	};

/**
 * Assign an event listener
 * @param {string} action - event(s)
 * @param {function} callback
 * @returns {object} current instance of Grindstone
 */

	$.fn.on = function(action, callback) {
		this.each(function() {
			var self = this;
			var events = action.split(' ');
			events.forEach(function(evt) {
				self.addEventListener(evt, callback, false);
			});
		});
		return this;
	};

/**
 * Remove an event listener
 * @param {string} action - event(s)
 * @param {function} callback
 * @returns {object} current instance of Grindstone
 */

	$.fn.off = function(action, callback) {
		this.each(function() {
			var self = this;
			var events = action.split(' ');
			events.forEach(function(evt) {
				self.removeEventListener(evt, callback, false);
			});
		});
		return this;
	};

/**
 * Check if any of the elements match the given selector or callback function
 * @param {string|function} filterBy - selector or callback function, return true to include
 * @returns {boolean} true if at least one of the elements matches the given selector
 */

	$.fn.is = function(filterBy) {
		if (typeof filterBy === 'function') {
            for (var i = 0; i < this.length; i++) {
                if (filterBy.call(this[i], i, this[i])) {
                    return true;
                }
            }
		} else {
            for (var i = 0; i < this.length; i++) {
                if (this[i][priv.matchesFuncName](filterBy)) {
                    return true;
                }
            }
        }
		return false;
	};

/**
 * Map each element to an array of values
 * @param {function} callback - return the value to be included, or null or undefined to skip
 * @returns {object} Grindstone object of included values returned from the callback
 */

	$.fn.map = function(callback) {
        var newSet = $();
        for (var i = 0; i < this.length; i++) {
            var ret = callback.call(this[i]);
            if (ret !== undefined && ret !== null) {
                newSet.push(ret);
            }
        }
        return newSet;
	};

/**
 * Filter the elements by the selector or callback function
 * @param {string|function} filterBy - selector or callback function, return true to include
 * @returns {object} new instance of Grindstone with the reduced set of matching elements
 */

	$.fn.filter = function(filterBy) {
        return $.fn.map.call(this, function() {
            if ($(this).is(filterBy)) {
                return this;
            }
        });
	};

/**
 * Excludes matching elements and includes not matching elements.
 * @param {string|function} filterBy - selector or callback function, return true to include
 * @returns {boolean} new instance of Grindstone with the reduced set of not matching elements
 */

	$.fn.not = function(filterBy) {
        return $.fn.map.call(this, function() {
            if (!$(this).is(filterBy)) {
                return this;
            }
        });
	};

/**
 * Get the first element
 * @returns {object} new instance of Grindstone with the first element
 */

    $.fn.first = function() {
        return $(this.set[0]);
    }

/**
 * Get the last element
 * @returns {object} new instance of Grindstone with the last element
 */

    $.fn.last = function() {
        return $(this.set[this.set.length - 1]);
    }


/**
 * Focus on the first element in the set or trigger a callback when some element is focused on
 * @param {function} callback - optional
 * @returns {object} current instance of Grindstone
 */
	
	$.fn.focus = function(callback) {
		if (typeof callback === 'function') {
			this.each(function() {
				$(this).on('focus', callback);
			});
		} else {
			this.set[0].focus();
		}
		return this;
	};

/**
 * Return the DOM element at the specified index of the current set
 * @param {number} index
 * @returns {object} the DOM element
 */

	$.fn.get = function(index) {
		return this.set[index];
	};

/**
 * Replace an element's inner HTML or return the current value
 * @param {string} content - optional
 * @returns {object|string} current instance of Grindstone or current value of an element's inner HTML
 */

	$.fn.html = function(content) {
		var text;
		this.each(function() {
			if (content || content === '') {
				this.innerHTML = content;
			} else {
				text = this.innerHTML;
			}
		});
		return content ? this : text;
	};
 

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


/**
 * Create hover and active states
 * @param {object} classes - hoverClass => value, activeClass => value, optional
 * @returns {object} current instance of Grindstone
 */

	$.fn.mouseable = function(classes) {
		
		var hoverClass, activeClass;
		
		if (classes) {
			if (typeof classes === 'object') {
				hoverClass  = priv.prop(classes, 'hoverClass')  ? classes['hoverClass']  : 'over';
				activeClass = priv.prop(classes, 'activeClass') ? classes['activeClass'] : 'down';
			} else {
				throw new Error('Classes parameter for mouseable() must be an object with properties "hoverClass" and/or "activeClass".');
			}
		} else {
			hoverClass  = 'over';
			activeClass = 'down';
		}
		
		var events = {
			hover:  priv.createInteraction('touchstart', 'mouseenter'),
			remove: priv.createInteraction('touchend', 'mouseleave'),
			down:   priv.createInteraction('touchstart', 'mousedown'),
			up: 	priv.createInteraction('touchend', 'mouseup mouseleave')
		};
		
		this.each(function() {

			$(this)
				.on(events.hover, function() {
					$(this).addClass(hoverClass);
				})
				.on(events.remove, function() {
					$(this).removeClass(hoverClass)
				})
				.on(events.down, function() {
					$(this).addClass(activeClass);
				})
				.on(events.up, function() {
					$(this).removeClass(activeClass);
				});
		});
		
		return this;
	};

/**
 * Return the left or top value of the selector, relative to the document
 * @param {string} position - "left" or "top"
 * @returns {number} offset value in px
 */

	$.fn.offset = function(position) {
		if (position && typeof position === 'string') {
			if (position !== 'left' && position !== 'top') {
				throw new Error('offset() position must be either "left" or "top".');
			} else {	
				var elem = this.set[0];
				if (position === 'left') {
					var offsetLeft = 0;
				    do {
				        if (!isNaN(elem.offsetLeft)) offsetLeft += elem.offsetLeft;
				    } while (elem = elem.offsetParent);
				    return offsetLeft;
				} else if (position === 'top') {
					var offsetTop = 0;
				    do {
				        if (!isNaN(elem.offsetTop)) offsetTop += elem.offsetTop;
				    } while (elem = elem.offsetParent);
				    return offsetTop;
				}
			}
		} else {
			throw new Error('offset() position must be a string: acceptable values are "left" and "top".');
		}
	};

/**
 * Trigger a function when the DOM content is loaded
 * @param {function} callback
 * @returns {object} current instance of Grindstone
 */

	$.fn.ready = function(callback) {
		if (typeof callback === 'function') {
			this.each(function() {
				$(this).on('DOMContentLoaded', callback);
			});
		}
		return this;
	};

/**
 * Trigger a function on the load event
 * @param {function} callback
 * @returns {object} current instance of Grindstone
 */

	$.fn.load = function(callback) {
		if (typeof callback === 'function') {
			this.each(function() {
				$(this).on('load', callback);
			});
		}
		return this;
	};

/**
 * Remove elements from the DOM
 * @param {object} target - target element(s) or selector, optional: if omitted, the element(s) invoking this method will be removed
 * @returns {object} current instance of Grindstone
 */

	$.fn.remove = function(target) {
		if (target) {
			$(target, this).remove();
		} else {
			this.each(function() {
				this.parentNode.removeChild(this);
			});
		}
		return this;
	};

/**
 * Replace an element with some other content
 * @param {object|string} content
 * @returns {object} current instance of Grindstone
 */

	$.fn.replaceWith = function(content) {
		this.each(function() {
			this.outerHTML = content ? content : "";
		});
		return this;
	};

/**
 * Capture the resize event from a set of elements and execute a function
 * @param {function} callback
 * @returns {object} current instance of Grindstone
 */

	$.fn.resize = function(callback) {
		if (typeof callback === 'function') {
			this.each(function() {
				$(this).on('resize', callback);
			});
		}
		return this;
	};
 
/**
 * Capture the scroll event and execute a function
 * @param {function} callback
 * @returns {object} current instance of Grindstone
 */

	$.fn.scroll = function(callback) {
		if (typeof callback === 'function') {
			this.each(function() {
				$(this).on('scroll', callback);
			});
		}
		return this;
	};
 
 /**
 * Scroll an element to a specific top position relative to its another parent container
 * Return the current top offset of an element, relative to its parent container
 * @param {number} top - offset in px, optional
 * @returns {object|number} current instance of Grindstone or top offset
 */

	$.fn.scrollTop = function(top) {
		var topOffset;
		this.each(function() {
			switch (this) {
				case w:
					if (typeof top === 'number') {
						this.scrollTo(0, top);
					} else {
						topOffset = this.pageYOffset;
					}
					break;
				case d:
					if (typeof top === 'number') {
						this.body.scrollTop = top;
					} else {
						topOffset = this.body.scrollTop;
					}
					break;
				default:
					if (typeof top === 'number') {
						this.scrollTop = top;
					} else {
						topOffset = this.scrollTop;
					}
			}
		});
		return typeof top === 'number' ? this : topOffset;
	};

/**
 * Scroll an element to a specific left position relative to its another parent container
 * Return the current left offset of an element, relative to its parent container
 * @param {number} left - offset in px, optional
 * @returns {object|number} current instance of Grindstone or left offset
 */

	$.fn.scrollLeft = function(left) {
		var leftOffset;
		this.each(function() {
			switch (this) {
				case w:
					if (typeof left === 'number') {
						this.scrollTo(left, 0);
					} else {
						leftOffset = this.pageXOffset;
					}
					break;
				case d:
					if (typeof left === 'number') {
						this.body.scrollLeft = left;
					} else {
						leftOffset = this.body.scrollLeft;
					}
					break;
				default:
					if (typeof left === 'number') {
						this.scrollTop = left;
					} else {
						leftOffset = this.scrollLeft;
					}
			}
		});
		return (typeof left === 'number') ? this : leftOffset;
	};

/**
 * Submit a form or trigger a function when a form is submitted
 * @param {function} callback - optional
 * @returns {object} current instance of Grindstone
 */
	
	$.fn.submit = function(callback) {
		if (typeof callback === 'function') {
			this.each(function() {
				$(this).on('submit', callback);
			});
		} else {
			this.each(function() {
				this.submit();
			});
		}
		return this;
	};


    priv.elementProp = function(set, propName, selector) {
        return $.fn.map.call(set, function() {
            var find = this;
            while (true) {
                var element = find[propName];
                if (!element) {
                    break;
                }
                if (element.nodeType != 1) {
                    find = element;
                    continue;
                }
                if (!selector || $(element).is(selector)) {
                    return element;
                }
                break;
            }
        });
    };

/**
 * Get the parent element as a Grindstone object
 * @param {string} selector - only get the parent if it matches the selector, optional
 * @returns {object} parents instance of Grindstone
 */

	$.fn.parent = function(selector) {
        return priv.elementProp(this, 'parentNode', selector);
	};

/**
 * Get the next element as a Grindstone object
 * @param {string} selector - only get the element if it matches the selector, optional
 * @returns {object} instance of Grindstone
 */

	$.fn.next = function(selector) {
        return priv.elementProp(this, 'nextSibling', selector);
	};

/**
 * Get the previous element as a Grindstone object
 * @param {string} selector - only get the element if it matches the selector, optional
 * @returns {object} instance of Grindstone
 */

	$.fn.prev = function(selector) {
        return priv.elementProp(this, 'previousSibling', selector);
	};

    priv.children = function(set, nodeType, selector) {
        var newSet = $();
        for (var i = 0; i < set.length; i++) {
            for (var child = set[i].firstChild; child; child = child.nextSibling) {
                if (nodeType === undefined || nodeType === child.nodeType) {
                    if (!selector || $(child).is(selector)) {
                        newSet.push(child);
                    }
                }
            }
        }
        return newSet;
    };

/**
 * Get the children elements as a Grindstone object
 * @param {string} selector - only get the element if it matches the selector, optional
 * @returns {object} children instance of Grindstone
 */

	$.fn.children = function(selector) {
        return priv.children(this, 1, selector);
	};

/**
 * Get all the children as a Grindstone object, including text and comments.
 * @returns {object} children instance of Grindstone
 */

	$.fn.contents = function() {
        return priv.children(this);
	};


/**
 * Dispatch a custom event
 * @param {number} evt - custom event
 * @returns {object|number} current instance of Grindstone or top offset
 */

	$.fn.trigger = function(evt) {
		var customEvent = new Event(evt);
		this.each(function() {
			this.dispatchEvent(customEvent);
		});
		return this;
	};
 
/**
 * Return or assign the value of an element
 * @param {string} newValue - optional
 * @returns {object|string} current instance of Grindstone or the value of the first element in the set
 */

	$.fn.val = function(newValue) {
		if (typeof newValue === 'string') {
			this.each(function() {
				this.value = newValue;
			});
			return this;
		} else {
			return this.set[0].value;
		}
	};

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
 
	return w.Grindstone = w.$ = $;
 
})(window, document);