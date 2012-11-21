function Geo(gl, verts){
	function makeBuffer(verts){
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
		return buffer;
	}

	this.itemSize = 3;
	this.numItems = verts.length / 3;
	this.glBuffer = makeBuffer(verts);
}