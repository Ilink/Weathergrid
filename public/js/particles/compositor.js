/*
Attach a compositor to a piece of geometry?
set and unset a bunch of framebuffers

build multiple programs
the renderer can add the attributes during the composite process, or something
that way, they can receieve all the correct attributes. 


Alternatively, the composite is created with a set of required attributes and uniforms.
If the uniforms are not present, it will not work. 
*/

function Compositor(gl, shaderPairs){
    var fbos = makeFbos();
    var shaderProgramBuilder = new ShaderProgramBuilder(gl);
    var self = this;

    // maybe use
    this.composite = function(texture){
        // Attach a texture to it.
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    };

    // maybe use
    this.unbind = function(){
    	setFramebuffer(null, canvas.width, canvas.height);
    	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    	// gl.viewport(0, 0, width, height);
    };

    this.programs = [];

    $.each(shaderPairs, function(i, pair){
        var program = shaderProgramBuilder.build(pair);
        self.programs.push(program);
    });
}