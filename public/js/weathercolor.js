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
	*/
	function make_base(i, row, col, season, temp){
		var increment = gradient_increment(row);

		var base_h;
		season = 'fall'
		switch(season) {
			case 'fall':
				base_h = 0;
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

		var fitted = fit_bound(temp, 0, 110, 0, 70);

		return {
			h: base_h + increment, // makes a nice subtle gradient
			s: Math.max(temp + row * 2, 90),
			l: Math.max(temp - (row/10), 10)
			// s: temp,
			// l: temp
		};
	}

	function mix_cloud(base, cloud_percent){
		var grey = shade.make_grey_shade(base);
		console.log('grey', grey);
		// oh god that looks bad
		return mixer.mix('color', grey, base, 100);
	}

	this.make = function(i, row, col, weather_data){
		base = make_base(i, row, col, weather_data.season, weather_data.temp);
		// console.log('base', base);
		final_color = base;
		final_color = mix_cloud(base, weather_data.cloud_cover);
		// console.log('final color:', final_color);
		return make_hsl(final_color);
	}

}
