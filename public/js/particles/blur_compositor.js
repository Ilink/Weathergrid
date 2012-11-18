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

    var size = $('canvas').width();

    // Create a color texture
    var colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Create the depth buffer
    var depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);

    // Create the framebuffer
    var framebuffer = gl.createFramebuffer();


    /*
    Ping pongs and does whatever
    then returns a texture result, or the final framebuffer
    */
    this.compose = function(setup, geo, texture){
        var textureResult;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

        // gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[0]);
        gl.useProgram(program);
        setup(program);


        // Attach a texture to it.
        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, geo.buffer.numItems);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return textureResult;
    };

    // maybe use
    function unbind(){
        setFramebuffer(null, canvas.width, canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // gl.viewport(0, 0, width, height); // should/will be set in Engine, not here
    };
   
}