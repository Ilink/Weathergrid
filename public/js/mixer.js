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

	function premultiply_opacity(hsl){
		hsl.h *= hsl.a;
		hsl.s *= hsl.a;
		hsl.l *= hsl.a;
	}

	var modes = {
		'color': function(top, bottom, opacity){
			var blended = {};

			premultiply_opacity(top, opacity);

			return {
				h: interp(bottom.h, top.h, opacity),
				s: interp(bottom.s, top.s, opacity),
				l: bottom.l
			};
		},
		// Straight interpolation
		'normal': function(top, bottom, opacity){
			console.log('mixing:', top, 'and bottom:', bottom)
			var blended = {};
			premultiply_opacity(top, opacity);
			top = hsl_to_rgb(top);
			bottom = hsl_to_rgb(bottom);

			var mixed_rgb = {
				r: interp(bottom.r, top.r, opacity),
				g: interp(bottom.g, top.g, opacity),
				b: interp(bottom.b, top.b, opacity),
			};

			var ret = rgb_to_hsl(mixed_rgb);
			return rgb_to_hsl(mixed_rgb);
		}
	}

	this.mix = function(mode, top, bottom, opacity){
		if(opacity > 1) throw "Opacity should a percent value from 0 to 1";
		if(typeof opacity === 'undefined') opacity = 1;
		if(typeof modes[mode] === 'undefined'){
			throw "Mode '" +mode+ "' undefined";
			return false;
		}
		return modes[mode].call(this, top, bottom, opacity);
	}

}