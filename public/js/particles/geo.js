var geo_builder = {
	/*
	Verts:
	2  4
	1  3
	*/
    rectangle: function(width, height){
        return [
            0.0,    0.0,        0.0,
            0.0,    height,     0.0,
            width,  0.0,        0.0,
            width,  height,     0.0
        ];
    },
    rectangle_gradient: [
    	0.0, 0.0, 0.0,
    	0.0, 1.0, 0.0,
    	1.0, 0.0, 0.0,
    	1.0, 1.0, 0.0
    ]
}