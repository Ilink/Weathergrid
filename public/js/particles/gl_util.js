/*
Makes two frame buffers, suitable for compositing operations
*/
function makeFbos(gl){
	var fbo, fbos = [];

	for(var i = 0; i < 2; i++){
		fbo = gl.createFramebuffer();
		fbos.push(fbo);
		
		// this is how you set / unset a FBO
		// gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		// gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	return fbos;
}

function initGeoBuffer(gl, verts){
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	buffer.itemSize = 3;
	buffer.numItems = verts.length/3;
	return buffer;	
}
