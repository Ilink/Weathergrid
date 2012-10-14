function Color(){
	this.mix = function(top, base, opacity, mode){
		return blend.color(top, base, opacity);
	};

	this.make_grey_compliment = function(base){
		return {
			h: base.h,
			s: Math.log(base.s)*2,
			v: base.v * 2
		}
	};
}