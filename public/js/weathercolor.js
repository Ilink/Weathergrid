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
		season = 'winter'
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
			s: 0.2,
			l: 0.60,
			a: 1
		};
	}

	function mix_cloud(base, percent){
		var grey = shade.make_grey_shade(base);
		return mixer.mix('normal', grey, base, percent);
	}

	function mix_experiment(base){
		var exp = shade.make_grey_shade(base, 1);
		// console.log('grey', exp);
		return mixer.mix('normal', exp, base, 1);
	}

	function mix_blue(base, percent){
		var blue = shade.make_blue(base, 1);
		// console.log('blue', blue);
		return mixer.mix('overlay', blue, base, percent);
	}

	function mix_purple(base, percent){
		var purpley_blue = shade.make('purpley_blue', 1);
		var purpley_blue = {
			h: 250,
			s: 0.63,
			l: 0.4,
			a: 1
		};

		return mixer.mix('normal', purpley_blue, base, percent);
	}

	function mix_compliment(base, percent){
		var compliment = get_compliment(hsl_to_rgb(base));
		compliment = rgb_to_hsl(compliment);

		return mixer.mix('normal', compliment, base, percent);
	}

	function overlay_test(base, percent){
		var blue = shade.make_blue(base, 1);
		return mixer.mix('overlay', blue, base, percent);
	}

	function lower_saturation(color, x){
		// we dont want the saturation higher than the original
		x = fit_bound(x, 0, 1, 0, color.s);
		color.s = x;
		return color;
	}

	this.make = function(i, row, col, weather_data){
		increment = gradient_increment(row) / 1.8;
		base = make_base(i, row, col, weather_data.season, weather_data.temp);
		final_color = base;
		// weather_data.temp = 100;
		var fitted_temp = fit_bound(weather_data.temp, 40, 100, 0, 1);

		final_color = mix_blue(base, fitted_temp);
		lower_saturation(final_color,  1-weather_data.cloud_cover);

		final_color.h += increment;

		return make_hsl(final_color);
	}

}
