function make_hsl(h,s,l){
	if(typeof h.h !== 'undefined'){
		var l = h.l || h.s || h.v;
		return "hsl("+h.h+","+h.s+"%,"+l+"%)";
	}
	return "hsl("+h+","+s+"%,"+l+"%)";
}

function fit_bound(min1, max1, x, min2, max2){
	return (max1 - min1) * (x-min1) / (max2 - min2) + min1;
}