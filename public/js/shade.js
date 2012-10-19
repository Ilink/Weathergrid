/*
Handles mixing in other colors

This could really be just a collection of functions. I dont really see
any state coming into play. Nor do I see any need for more than one of these
to exist. 
*/

function Shade(){

	this.make_grey_shade = function(base){
		return {
			h: base.h-50,
			s: Math.pow(base.s, 0.7),
			l: base.l / 10
		}
	};
}