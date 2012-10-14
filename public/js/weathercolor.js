function Weathercolor(){

	var golden_ratio_conjugate = 0.61803398875, 
		base,
		final_color,
		color = new Color();

	function make_base(i, row, col, temp){
		var percent = i * 100 % golden_ratio_conjugate * 100;
		var test = fit_bound(0, 360, temp, 0, 100);
		console.log('bound fit', test);

		console.log('percent temp', percent * test, percent);

		return {
			// h: Math.max(percent-10, 15),
			h: test + percent,
			s: Math.max((row * 10), 50),
			v: Math.max((col * 20), 45)
		};
	}

	function mix_cloud(base, weather_data){
		var grey = color.make_grey_compliment(base);
		console.log('grey', grey);
		return color.mix(grey, base, 0.5);
	}

	this.make = function(i, row, col, weather_data){
		base = make_base(i, row, col, weather_data.temp);
		console.log('base', base);
		final_color = base;
		// final_color = mix_cloud(base, weather_data);
		return make_hsl(final_color);
	}

}

