function make_hsl(h,s,l){
	if(typeof h.h !== 'undefined'){
		return "hsl("+h.h+","+h.s+"%,"+h.l+"%)";
	}
	return "hsl("+h+","+s+"%,"+l+"%)";
}

/*
map from range1 to range2
*/
function fit_bound(x, min1, max1, min2, max2){
	return (max2 - min2) * (x-min1) / (max1 - min1) + min2;
}

function get_coords(callback){
	navigator.geolocation.getCurrentPosition(function(geo){
		callback.call(this, geo);
	});
}

function cap(x, min, max){
	if(x < min) return min;
	if(x > max) return max;
	return x;
}

function join_o(obj, char){
	var str = '';
	$.each(obj, function(k, v){
		str += v + char;
	});
	return str.slice(0, str.length-1);
}

// http://www.cs.rit.edu/~ncs/color/t_convert.html
// Converted to Javascript, with a few other changes
// in particular, it did not have a percent conversion for brightness
function rgb_to_hsl(rgb){
	var min, max, delta, hsl = {};
	min = Math.min(rgb.r, rgb.g, rgb.b);
	max = Math.max(rgb.r, rgb.g, rgb.b);

	hsl.l = max/256;
	delta = max - min;
	if(max !== 0)
		hsl.s = delta / max;
	else { // in this case, r,g,b all = 0
		hsl.s = 0;
		hsl.h = -1; // I dont know if this plays well with CSS3
		return false;
	}
	if(rgb.r === max)
		hsl.h = (rgb.g - rgb.b) / delta;		// between yellow & magenta
	else if(rgb.g == max)
		hsl.h = 2 + (rgb.b - rgb.r) / delta;	// between cyan & yellow
	else
		hsl.h = 4 + (rgb.r - rgb.g) / delta;		// between magenta & cyan
	hsl.h *= 60; // convert to degrees
	if(hsl.h < 0)
		hsl.h += 360;

	// CSS HSL values use 0-100% for saturation and lightness
	// This algorithm expects 0-1, so we multiply by 100.
	hsl.s *= 100;
	hsl.l *= 100;

	return hsl;
}

// http://www.cs.rit.edu/~ncs/color/t_convert.html
// Converted to Javascript, with a few other changes
function hsl_to_rgb(hsl){
	// CSS HSL values use 0-100% for saturation and lightness
	// This algorithm expects 0-1, so we divide by 100.
	hsl.s /= 100;
	hsl.l /= 100;
	var h_round, h_int, p, q, t, rgb = {};
	if(hsl.s == 0) {
		rgb.r = rgb.g = rgb.b = hsl.l;
		return false;
	}
	hsl.h /= 60;			// divide into 5ths
	h_round = Math.floor(hsl.h);
	h_int = hsl.h - h_round;	// int part of h
	p = hsl.l * (1 - hsl.s);
	q = hsl.l * (1 - hsl.s * h_int);
	t = hsl.l * (1 - hsl.s * (1 - h_int));
	console.log(p,q,t, hsl);
	switch(h_round) {
		case 0:
			rgb.r = hsl.l;
			rgb.g = t;
			rgb.b = p;
			break;
		case 1:
			rgb.r = q;
			rgb.g = hsl.l;
			rgb.b = p;
			break;
		case 2:
			rgb.r = p;
			rgb.g = hsl.l;
			rgb.b = t;
			break;
		case 3:
			rgb.r = p;
			rgb.g = q;
			rgb.b = hsl.l;
			break;
		case 4:
			rgb.r = t;
			rgb.g = p;
			rgb.b = hsl.l;
			break;
		default:		// case 5:
			rgb.r = hsl.l;
			rgb.g = p;
			rgb.b = q;
			break;
	}
	rgb.r *= 256;
	rgb.g *= 256;
	rgb.b *= 256;
	return rgb;
}