function color_box(i, r, c, opacity){
	var golden_ratio_conjugate = 0.61803398875;
	var percent = i * 100 % golden_ratio_conjugate * 100;

	var base = {
		h: Math.max(percent, 15)-100,
		s: Math.max((r * 10), 15),
		v: Math.max((c * 20), 45)
	};

	// override for testing
	opacity = 0.7;

	var grey = make_grey_compliment(base);

	var grey_mix = blend.color(grey, base, opacity);
	var hsl = make_hsl(grey_mix.h, grey_mix.s, grey_mix.v);
	return hsl;
}

var colors = {
	grey: {
		h: 206,
		s: 12,
		v: 93
	}
};

/*
base is a hsl object
*/
function make_grey_compliment(base){
	return {
		h: base.h,
		s: Math.log(base.s)*2,
		v: base.v * 2
	}
}