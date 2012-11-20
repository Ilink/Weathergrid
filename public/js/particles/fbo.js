function Fbo(gl){
	var self = this;

	function makeFbo(){
		// Create the framebuffer
		var framebuffer = gl.createFramebuffer();

		// Create the depth buffer
		framebuffer.depthBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depthBuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);

		// Create a color texture
		framebuffer.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		return framebuffer;
	}

	this.fbo = makeFbo();

	this.activate = function(){
		gl.bindFramebuffer(gl.FRAMEBUFFER, self.fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, self.fbo.depthBuffer);
	};

	this.deactivate = function(){
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	};
}

function Fbo(gl){

}