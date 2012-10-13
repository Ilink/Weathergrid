blend = {};

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

blend.interp = function(a, b, percent){
	var diff = Math.abs(a - b);
	var result;
	if(a < b){
		result = a + (diff * percent);
	} else {
		result = a - (diff * percent);
	}
	return result;
}

blend.color = function(top, bottom, opacity){
	if(typeof opacity === 'undefined') opacity = 1;
	var blended = {};

	return {
		h: blend.interp(bottom.h, top.h, opacity),
		s: blend.interp(bottom.s, top.s, opacity),
		v: bottom.v
	};
};