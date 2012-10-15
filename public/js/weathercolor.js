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

	function make_base(i, row, col, temp){
		var percent = i * 100 % golden_ratio_conjugate * 100;
		var fitted = fit_bound(temp, 0, 100, 180, 270);

		return {
			h: fitted + percent, // makes a nice subtle gradient
			s: Math.max((row * 10), 50),
			v: Math.max((col * 20), 45)
		};
	}

	function mix_cloud(base, cloud_percent){
		var grey = shade.make_grey_shade(base);
		console.log('grey', grey);
		// cloud_percent = 0;
		return mixer.mix('color', grey, base, cloud_percent);
	}

	this.make = function(i, row, col, weather_data){
		base = make_base(i, row, col, weather_data.temp);
		console.log('base', base);
		final_color = base;
		final_color = mix_cloud(base, weather_data.cloud_cover);
		return make_hsl(final_color);
	}

}

