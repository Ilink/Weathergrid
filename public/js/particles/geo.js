var geo_builder = {
	rectangle: function(width, height){
	    return [
	        0.0,    0.0,        0.0,
	        0.0,  height,        0.0,
	        width,    0.0,     0.0,
	        width,  height,     0.0
	    ];
	}
}