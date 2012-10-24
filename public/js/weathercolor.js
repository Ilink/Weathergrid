/*
Creates colors from the weather and season. 
Mixes in shades depending upon various weather factors.
Brightness is generally controlled by temperature. 
*/

function Weathercolor(){

	var golden_ratio_conjugate = 0.61803398875, 
		base,
		final_color,
		shade = new Shade(),
		mixer = new Mixer();

	function gradient_increment(i){
		return i * 100 % golden_ratio_conjugate * 100;
	}

	/*
	Make the base color, from the season and temperature
	Temperature controls lightness and the saturation.
	The season controls the hue. This gives us the ability to define season-specific colorsets.

	This setup looks really bad for lower temperatures. I need to mix in other colors or something
	to make them better.
	*/
	function make_base(i, row, col, season, temp){
		var increment = gradient_increment(row);
		// temp = 80;

		var base_h;
		season = 'fall'
		switch(season) {
			case 'fall':
				base_h = 18;
				increment /= 2;
				break;
			case 'winter':
				base_h = 210;
				break;
			case 'spring':
				base_h = 110;
				break;
			case 'summer':
				base_h = 180;
				break;
		}

		var fitted_temp = fit_bound(temp, 0, 110, 0, 1);

		// If we go above 360, I think it does weird things when mixing colors later
		if(base_h + increment > 360) base_h = 0;
		return {
			h: base_h + increment/2, // makes a nice subtle gradient
			// h: base_h,
			// s: Math.max(fitted_temp + row * 2, 50),
			// l: cap(fitted_temp - (row/10), 0, 100)
			s: 0.75,
			l: 0.60,
			a: 1
		};
	}

	function mix_cloud(base, percent){
		var grey = shade.make_grey_shade(base);
		// var percent = 0.6;
		console.log('grey mix', grey);
		return mixer.mix('normal', grey, base, percent);
	}

	function mix_experiment(base){
		var exp = shade.make_grey_shade(base, 1);
		console.log('grey', exp);
		return mixer.mix('normal', exp, base, 1);
	}

	function mix_blue(base, percent){
		var blue = shade.make_blue(base, 1);
		console.log('blue', blue);
		return mixer.mix('normal', blue, base, percent);
	}

	function mix_compliment(base, percent){
		var compliment = get_compliment(hsl_to_rgb(base));
		compliment = rgb_to_hsl(compliment);

		// var blue = shade.make_blue(base, 1);
		// return mixer.mix('normal', blue, base, percent);
		// console.log(compliment);

		return mixer.mix('normal', compliment, base, percent);
	}

	function overlay_test(base, percent){
		var blue = shade.make_blue(base, 1);
		return mixer.mix('overlay', blue, base, percent);
	}

	this.make = function(i, row, col, weather_data){
		increment = gradient_increment(row) / 2;
		base = make_base(i, row, col, weather_data.season, weather_data.temp);
		final_color = base;
		var fitted_temp = fit_bound(weather_data.temp, 40, 100, 0, 1);

		// final_color = mix_compliment(base, .75);
		final_color = overlay_test(base, 0.35);
		// final_color = mix_blue(final_color, 0.7);
		// final_color = mix_cloud(final_color, .70);

		// final_color.h += increment;

		// final_color = mix_experiment(base);
		return make_hsl(final_color);
	}

}
