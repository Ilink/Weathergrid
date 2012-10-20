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

		// If we go above 360, I think it does weird things when mixing colors later
		if(base_h + increment > 360) base_h = 0;
		return {
			h: base_h + increment, // makes a nice subtle gradient
			s: Math.max(temp + row * 2, 90),
			l: cap(temp - (row/10), 0, 100)
			// s: temp,
			// l: temp
		};
	}

	function mix_cloud(base, cloud_percent){
		var grey = shade.make_grey_shade(base);
		// var cloud_percent = 0.6;
		return mixer.mix('color', grey, base, cloud_percent);
	}

	this.make = function(i, row, col, weather_data){
		base = make_base(i, row, col, weather_data.season, weather_data.temp);
		// console.log('base', base);
		final_color = base;
		final_color = mix_cloud(base, weather_data.cloud_cover);
		return make_hsl(final_color);
	}

}
