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
