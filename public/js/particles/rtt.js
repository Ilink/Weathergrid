/*
Render-to-texture

Takes a texture that is created for/by a framebuffer.
Generates a mipmap for the texture.
Displays the texture on a fullscreen quad
*/


// function Rtt(gl, texture, textureBuffer, sampler, attr){
function Rtt(gl, texture, sampler, attr){
	var quad = new Geo(geo_builder.fullScreenQuad);

	var coords = [
	    0.0, 0.0,
	    0.0, 1.0,
	    1.0, 0.0,
	    1.0, 1.0
	];

	// generate mipmaps
	function setup(){
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	setup();

	this.glTexture = gl.createTexture();
	this.draw = function(){
		// Bind the texture
		// gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		// gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0); // itemsize (2) might be wrong - is it 3?
		gl.activeTexture(gl.TEXTURE0);

		// gl.bindTexture(gl.TEXTURE_2D, self.glTexture);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(sampler, 0);

		// Draw the quad
		gl.bindBuffer(gl.ARRAY_BUFFER, quad.glBuffer);
		gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
}