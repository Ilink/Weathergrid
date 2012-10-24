/*
Mixer
Lets you mix colors, in ways similar to Photoshop and other image compositing tools.
I'm sort of implementing as I go, so not everyting is here.

Bottom = the original layer
Top = the layer you want to blend

Color:
	Blends the hue and saturation from the bottom and the top.
	Lightness is taken from the bottom.
*/

function Mixer(){

	/*
	Right now, this doesn't calculate alpha for the base color
	see http://stackoverflow.com/questions/7438263/alpha-compositing-algorithm-blend-modes/11163848#comment17571004_11163848 
	for how it should be done
	*/

	/*
	Apparently, this isn't really the correct way of doing this.
	Photoshop does it like this:
		O * top + (1 - O) * bottom

	I must experiment to see which looks better for my purposes.
	*/
	function interp(a, b, percent){
		var diff = Math.abs(a - b);
		var result;
		if(a < b){
			result = a + (diff * percent);
		} else {
			result = a - (diff * percent);
		}
		return result;
	}

	// Accepts either RGB or HSL
	function premultiply_opacity(color){
		$.each(color, function(k, v){
			if(k !== 'a')
				color[k] *= color.a
		});
		return color;
	}

	function demultiply_opacity(color){
		if(color.a > 0){ // avoid divide by zero errors
			$.each(color, function(k, v){
				if(k !== 'a')
					color[k] = color[k] / color.a
			});
		}
		return color;
	}

	function rgb_mixer_wrapper(hsl, callback){

	}

	/*
	todo: implement
	These will wrap and provide basic functionality for making
	new mixing modes. They perform the staple procedures needed before and after
	a mix. 
	*/
	function hsl_mixer_wrapper(top, bottom, opacity, callback){
		premultiply_opacity(top);
	}

	var modes = {
		'color': function(top, bottom, opacity){
			console.log('mixing with opacity: ', opacity);

			premultiply_opacity(top);

			var mixed = {
				h: interp(bottom.h, top.h, opacity),
				s: interp(bottom.s, top.s, opacity),
				l: bottom.l,
				a: 1
			};
			return demultiply_opacity(mixed, top.a);
		},
		// Straight interpolation
		'normal': function(top, bottom, opacity){
			// console.log('mixing with opacity: ', opacity);
			// console.log('mixing:', top, 'and bottom:', bottom)
			premultiply_opacity(top);
			top = hsl_to_rgb(top);
			bottom = hsl_to_rgb(bottom);

			var mixed_rgb = {
				r: interp(bottom.r, top.r, opacity),
				g: interp(bottom.g, top.g, opacity),
				b: interp(bottom.b, top.b, opacity),
				a: 1
			};

			var mixed_hsl = rgb_to_hsl(mixed_rgb);
			// console.log(mixed_hsl);
			return demultiply_opacity(mixed_hsl, top.a);
		},
		'overlay': function(top, bottom, opacity){
			top = hsl_to_rgb(top);
			bottom = hsl_to_rgb(bottom);

			function mix(a, b){
				return (b < 128) ? (2 * a * b / 255):(255 - 2 * (255 - a) * (255 - b) / 255);
			}

			// Compute the mixed layer, igoring opacity
			var mixed_rgb = {
				r: mix(bottom.r, top.r),
				g: mix(bottom.g, top.g),
				b: mix(bottom.b, top.b)
			}

			// Interpolate result with original base layer
			mixed_rgb.r = interp(bottom.r, mixed_rgb.r, opacity); 
			mixed_rgb.g = interp(bottom.g, mixed_rgb.g, opacity);
			mixed_rgb.b = interp(bottom.b, mixed_rgb.b, opacity);

			// todo: demultiply alpha here
			return rgb_to_hsl(mixed_rgb);
		}
	}

	this.mix = function(mode, top, bottom, opacity){
		// console.log(mode, top, bottom, opacity);
		if(opacity > 1) throw "Opacity should a percent value from 0 to 1";
		if(typeof opacity === 'undefined') opacity = 1;
		if(typeof modes[mode] === 'undefined'){
			throw "Mode '" +mode+ "' undefined";
			return false;
		}

		return modes[mode].call(this, top, bottom, opacity);
	}

}