/*!
 * jQuery alignWith plug-in v1.0.2
 * Align two or more elements with each other
 *
 * @requires jQuery v1.2 or later
 *
 * Copyright (c) 2009 Gilmore Davidson
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
/**
 * @param mixed elem - HTML element to align with
 * @param string position (optional) - A 1-4 character string defining the points to match on each element
 * @param object options (optional) - An options object (see below)
 *
 *
 * Position:
 *
 *   The position string can be 1-4 characters in length, made up of any of the following:
 *     'b' = Bottom
 *     'c' OR 'm' = Centre/Middle
 *     'l' = Left
 *     'r' = Right
 *     't' = Top
 *
 *   The positioning of the element depends on the length of the position string:
 *
 *      Length = 0 (or missing):
 *		  The centre points of both elements will be aligned.
 *
 *      Length = 1:
 *        ('c' or 'm') The centre points of both elements will be aligned.
 *        ('b', 'l', 'r' or 't') The mid points of the defined SIDE will be matched (eg. For 't', the centres of the top edges will be aligned).
 *
 *      Length = 2:
 *        The defined point on each element will be aligned.
 *        (eg. 'tl' = top left corner, 'rb' = bottom right corner, 'ml' = Left side mid-point)
 *
 *      Length = 3:
 *        The first two characters define a point on the element to move.
 *        the third character defines a side (or the centre point) of the target element.
 *        (eg. 'tlr' = move the top left corner of the first element to the mid point of the right side on the second element)
 *
 *      Length = 4:
 *        The first two characters define a point on the element to move.
 *        The last two characters define a point on the target element.
 *
 *        This option provides the most control over positioning, allowing 81 different point-to-point combinations.
 *
 *
 * Options:
 *
 *   The options object can define some additional parameters:
 *
 *     x: (integer, default 0) X offset, this value is added to the 'left' css property of the moving element.
 *     y: (integer, default 0) Y offset, this value is added to the 'top' css property of the moving element.
 *     appendToBody: (boolean, default false) If set to true, the moving element will be appended to the document body in the DOM.
 *                   This is to overcome a situation where the moving element is a child of an element with 'position:relative;' and will not be positioned correctly otherwise.
 *
 *     x and y can also be negative integers.
 *
 *
 * Examples:
 *
 *   Basic usage, only defining the two elements - will match the centres of each element:
 *
 *     jQuery('.moveMe').alignWith('#stayput');
 *
 *   Match the left mid points of each element:
 *
 *     jQuery('.moveMe').alignWith('#stayput', 'l');
 *
 *   Match the top left corners of each element:
 *
 *     jQuery('.moveMe').alignWith('#stayput', 'tl');
 *
 *   Match the top left corner of the moving element with the centre of the static element:
 *
 *     jQuery('.moveMe').alignWith('#stayput', 'tlc');
 *
 *   Match the top left corner of the moving element with the top right corner of the static element:
 *
 *     jQuery('.moveMe').alignWith('#stayput', 'tltr');
 *
 *   Match the top left corner of the moving element with the top right corner of the static element
 *    and add a 5px x/y offset:
 *
 *     jQuery('.moveMe').alignWith('#stayput', 'tltr', {x:5,y:5});
 *
 *   Match the top left corner of the moving element with the top right corner of the static element
 *    and append to the document body:
 *
 *     jQuery('.moveMe').alignWith('#stayput', 'tltr', {appendToBody:true});
 *
 *
 * Notes:
 *
 *   alignWith includes element borders and padding in the width and height calculations, but excludes margins.
 *   This ensures that the entire visible element will be positioned correctly.
 *
 *   Options to exclude borders/padding may come further down the track.
 *
 *   There is a known bug in Internet Explorer where the positioning will be messed up if there's not a valid doctype declaration.
 *   I'm not going to try to fix this one as an HTML document should have a valid doctype to begin with.
 * 
 */
(function($){
	$.fn.extend({
		alignWith: function(elem, pos, options) {
			// jQuery-fy elem
			elem = $(elem);
			// Setup initial position vars for elem
			var eOff = elem.offset(),
				eX = eOff.left,
				eY = eOff.top,
				eW = elem.outerWidth(),
				eH = elem.outerHeight(),
				// Position placeholders
				pT = '',
				pE = '',
				args = [],
				// Position matching regex patterns
				rXM = /^([tbcm]{2}|lr|rl)$/i,
				rXR = /^r?[rtbcm]r?$/i,
				rYM = /^([lrcm]{2}|tb|bt)$/i,
				rYB = /^b?[lrbcm]b?$/i,
				// CSS rules
				tCss = {
					position: 'absolute',
					left: eX,
					top: eY
				},
				// Default options
				op = {
					x: 0,
					y: 0,
					appendToBody: false
				};
			if (undefined !== options) {
				$.extend(op, options);
			}
			// Reset pos if it's invalid
			if (!/^[tblrcm]{1,4}$/.test(pos)) {
				pos = 'c';
			}
			// Flesh out 4-point position string
			args = pos.split('');
			switch (args.length) {
				case 1:
					pT = pE = '' + pos + pos;
					break;
				case 2:
					pT = pE = pos;
					break;
				case 3:
					pT = '' + args[0] + args[1];
					pE = '' + args[2] + args[2];
					break;
				case 4:
					pT = '' + args[0] + args[1];
					pE = '' + args[2] + args[3];
					break;
			}

			// Move the elements
			return this.each(function(){
				// Get dimensions for element to move
				var t = $(this),
					tX = eX,
					tY = eY,
					tW = t.outerWidth(),
					tH = t.outerHeight();
				// Test for X-points of this
				if (rXM.test(pT)) {
					tX -= (tW / 2);
				} else if (rXR.test(pT)) {
					tX -= tW;
				}
				// Test for X-points of elem
				if (rXM.test(pE)) {
					tX += (eW / 2);
				} else if (rXR.test(pE)) {
					tX += eW;
				}
				// Test for Y-points of this
				if (rYM.test(pT)) {
					tY -= (tH / 2);
				} else if (rYB.test(pT)) {
					tY -= tH;
				}
				// Test for Y-points of elem
				if (rYM.test(pE)) {
					tY += (eH / 2);
				} else if (rYB.test(pE)) {
					tY += eH;
				}
				// Account for margins pushing out the position
				// Also account for NaN values since IE reads an unset margin as 'auto' instead of '0px'
				// (http://plugins.jquery.com/node/10969)
				tX -= parseInt(t.css('margin-left'), 10) || 0;
				tY -= parseInt(t.css('margin-top'), 10) || 0;
				// Add any offset specified in the options
				if (0 !== op.x) {
					tX += parseInt(op.x, 10);
				}
				if (0 !== op.y) {
					tY += parseInt(op.y, 10);
				}
				// Apply css rules
				tCss.left = tX;
				tCss.top = tY;
				t.css(tCss);
				// Check for attachment option
				if (op.appendToBody) {
					t.appendTo('body');
				}
			});
		}
	});
})(jQuery);
