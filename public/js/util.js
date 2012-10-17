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