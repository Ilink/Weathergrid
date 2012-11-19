/*
Attach a compositor to a piece of geometry?
set and unset a bunch of framebuffers

build multiple programs
the renderer can add the attributes during the composite process, or something
that way, they can receieve all the correct attributes. 


Alternatively, the composite is created with a set of required attributes and uniforms.
If the uniforms are not present, it will not work. 
*/

function BlurCompositor(gl, shaderPairs){
    // var fbos = makeFbos(gl);
    var fbos = [];
    var shaderProgramBuilder = new ShaderProgramBuilder(gl);
    var self = this;

    this.programs = [];
    // $.each(shaderPairs, function(i, pair){
        // var program = shaderProgramBuilder.build(pair);
        // self.programs.push(program);
    // });
    var program = shaderProgramBuilder.build(shaderPairs[0]);
    var program2 = shaderProgramBuilder.build(shaderPairs[1])
    self.programs.push(program);
    self.programs.push(program2);

    var size = 1024;
    var textureResult;

    function setupQuad(){
        var verts = [
            -1,   -1,     0.0, // bot left
            -1,    1,     0.0, // top left
            1,    -1,     0.0, // bot right
            1,     1,     0.0  // top right
        ];
        var tmat = [0,0,-40];

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        buffer.itemSize = 3;
        buffer.numItems = verts.length/3;
        return buffer;
    }

    var quad = setupQuad();

    function drawQuad(){
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, quad.numItems);
    }

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

    function activateFbo(fbo, texture){
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);
    }

    fbos[0] = makeFbo();
    fbos[1] = makeFbo();

    /*
    Ping pongs and does whatever
    then returns a texture result, or the final framebuffer
    */
    var first = true;
    this.compose = function(setup, geo, texture){
        if(first){
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            first = false;
        }
        var textureResult;
        activateFbo(fbos[0], fbos[0].texture);

        gl.useProgram(program);
        setup(program);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, geo.buffer.numItems);

        // send result to the next framebuffer
        
        // activateFbo(fbos[1], fbos[0].texture);
        gl.useProgram(program2);
        gl.bindTexture(gl.TEXTURE_2D, fbos[0].texture);
        setup(program2);

        /*
        Ideas about what is wrong:
            => the background isn't drawn, so the sampler has nothing to grab from
                => draw quad
        */

        // gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[1]);
        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbos[0].texture, 0);

    
        // exit
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        drawQuad();
        return textureResult;
    };

    // maybe use
    function unbind(){
        setFramebuffer(null, canvas.width, canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // gl.viewport(0, 0, width, height); // should/will be set in Engine, not here
    };
   
}