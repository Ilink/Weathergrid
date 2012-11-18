/*
Attach a compositor to a piece of geometry?
set and unset a bunch of framebuffers

build multiple programs
the renderer can add the attributes during the composite process, or something
that way, they can receieve all the correct attributes. 


Alternatively, the composite is created with a set of required attributes and uniforms.
If the uniforms are not present, it will not work. 
*/

function BlurCompositor(gl, shaderPair){
    var fbos = makeFbos(gl);
    var shaderProgramBuilder = new ShaderProgramBuilder(gl);
    var self = this;

    this.programs = [];
    // $.each(shaderPairs, function(i, pair){
        // var program = shaderProgramBuilder.build(pair);
        // self.programs.push(program);
    // });
    var program = shaderProgramBuilder.build(shaderPair);
    self.programs.push(program);

    /*
    Ping pongs and does whatever
    then returns a texture result, or the final framebuffer
    */
    this.compose = function(setup, geo, texture){
        var textureResult;
        gl.useProgram(program);

        // Attach a texture to it.
        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, geo.buffer.numItems);
        return textureResult;
    };

    // maybe use
    function unbind(){
        setFramebuffer(null, canvas.width, canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // gl.viewport(0, 0, width, height); // should/will be set in Engine, not here
    };
   
}