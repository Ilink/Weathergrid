function initGeoBuffer(gl, verts){
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	buffer.itemSize = 3;
	buffer.numItems = verts.length/3;
	return buffer;	
}

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
    ],
    fullScreenQuad: [
        -1,   -1,     0.0, // bot left
        -1,    1,     0.0, // top left
        1,    -1,     0.0, // bot right
        1,     1,     0.0  // top right
    ];
}