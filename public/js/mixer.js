/*
@blend color
Top = top layer
bottom = bottom layer
Think about it like Photoshop

V comes from bottom layer
takes H and S from top layer

Opactiy is the amount of top mixed with bottom.

The opactiy is not working, obviously.
It should be partway between the top value and the bottom value.
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

	function premultiply_opacity(hsl, opacity){
		hsl.h *= opacity;
		hsl.s *= opacity;
		hsl.l *= opacity;
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
		}
	}

	this.mix = function(mode, top, bottom, opacity){
		if(typeof opacity === 'undefined') opacity = 1;
		if(typeof modes[mode] === 'undefined'){
			throw "Mode '" +mode+ "' undefined";
			return false;
		}
		return modes[mode].call(this, top, bottom, opacity);
	}

}