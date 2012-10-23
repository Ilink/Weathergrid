/*
Handles mixing in other colors

This could really be just a collection of functions. I dont really see
any state coming into play. Nor do I see any need for more than one of these
to exist. 
*/

function Shade(){
}

Shade.prototype.make_grey_shade = function(base, a){
	return {
		h: base.h,
		// s: Math.pow(base.s, 0.7),
		s: base.s / 2,
		l: base.l / 2,
		a: a || 1
	}
};

Shade.prototype.make_blue_shade = function(base, a){
	return {
		h: 209,
		s: 0.82,
		l: 0.69,
		a: a || 1
	}
};

Shade.prototype.make_blue = function(base, a){
	return {
		h: 203,
		s: 0.78,
		l: 0.60,
		a: a || 1
	}
};