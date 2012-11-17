/*
Attach a compositor to a piece of geometry?
set and unset a bunch of framebuffers
*/

function Compositor(gl){

    // Create a framebuffer
    var fbo = gl.createFramebuffer();
    framebuffers.push(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    this.composite = function(texture){
        // Attach a texture to it.
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }

    this.unbind = function(){
    	setFramebuffer(null, canvas.width, canvas.height);
    	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    	// gl.viewport(0, 0, width, height);
    }
}