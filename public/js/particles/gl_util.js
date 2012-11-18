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
}