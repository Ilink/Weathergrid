function make_hsl(h,s,l){
	if(typeof h.h !== 'undefined'){
		var l = h.l || h.s || h.v;
		return "hsl("+h.h+","+h.s+"%,"+l+"%)";
	}
	return "hsl("+h+","+s+"%,"+l+"%)";
}

/*
map from range1 to range2
*/
function fit_bound(x, min1, max1, min2, max2){
	return (max2 - min2) * (x-min1) / (max1 - min1) + min2;
}