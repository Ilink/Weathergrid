/*
Renderer
Default one - this handles spirtes and the background.
*/

function RainRenderer(gl, shaders, rttShaders){
    RendererBase.call(this, {gl: gl, shaders: shaders});

    var self = this;
    var mvMatrix = mat4.create();
    var textureCoordAttribute;
    var vertColor;
    var position;
    var gradient_coords =  [
        0.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ];
    var fbo = new Fbo(gl, 256);
    var rttProgram = buildShaderProgram(gl, rttShaders);
    
    // this stays per-renderer
    function setup_shaders() {
        position = gl.getAttribLocation(self.shaderProgram, "position");
        gl.enableVertexAttribArray(position);

        textureCoordAttribute = gl.getAttribLocation(self.shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(textureCoordAttribute);

        vertColor = gl.getAttribLocation(self.shaderProgram, "vertColor");
        gl.enableVertexAttribArray(vertColor);
    }

    // this stays per-renderer
    function build(dim, pMatrix, pMatrixInv){
        fbo.activate();
        $.each(self.geo, function(i, geo){
            mat4.identity(mvMatrix); // reset the position for each piece of geometry
            mat4.translate(mvMatrix, geo.trans);
            mat4.rotate(mvMatrix, 40, [0,0,1], mvMatrix);

            self.__setDefaultUniforms(self.shaderProgram, pMatrix, mvMatrix, dim);

            // Textures
            if(typeof geo.texture !== 'undefined'){
                geo.texture.set();
            }

            gradientBuffer.set();

            gl.bindBuffer(gl.ARRAY_BUFFER, geo.buffer);
            gl.vertexAttribPointer(position, geo.buffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, geo.buffer.numItems);
            
        });
        fbo.deactivate();
        gl.useProgram(rttProgram);
        mat4.identity(mvMatrix); // reset the position for each piece of geometry
        // mat4.translate(mvMatrix, [0,0,-10]);
        // self.__setDefaultUniforms(self.shaderProgram, pMatrix, mvMatrix, dim);
        rtt.draw();
    }

    var gradientBuffer = new Buffer(gl, gradient_coords, 2, position);
    setup_shaders();
    var sampler = self.gl.getUniformLocation(self.shaderProgram, "uSampler");
    var rtt = new Rtt(gl, fbo.glTexture, sampler, position);

    this.render = function(time, dim, pMatrix, pMatrixInv) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        build(dim, pMatrix, pMatrixInv);
    };
}

RainRenderer.prototype = new RendererBase();
RainRenderer.prototype.constructor = RainRenderer;