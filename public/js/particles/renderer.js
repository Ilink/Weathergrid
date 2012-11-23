/*
Renderer
Default one - this handles spirtes and the background.
*/

function Renderer(gl, shaders, textures){
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
    
    // this stays per-renderer
    function setup_shaders() {
        position = gl.getAttribLocation(self.shaderProgram, "position");
        if(position > -1)
            gl.enableVertexAttribArray(position);

        textureCoordAttribute = gl.getAttribLocation(self.shaderProgram, "aTextureCoord");
        if(textureCoordAttribute > -1)
            gl.enableVertexAttribArray(textureCoordAttribute);

        vertColor = gl.getAttribLocation(self.shaderProgram, "vertColor");
        if(vertColor > -1)
            gl.enableVertexAttribArray(vertColor);
    }

    // this stays per-renderer
    function build(dim, pMatrix, pMatrixInv){
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
            gl.bindBuffer(gl.ARRAY_BUFFER, geo.glBuffer);
            gl.vertexAttribPointer(position, geo.itemSize, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, geo.numItems);
        });
    }

    var gradientBuffer = new Buffer(gl, gradient_coords, 2, position);
    setup_shaders();

    this.render = function(time, dim, pMatrix, pMatrixInv) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        build(dim, pMatrix, pMatrixInv);
    };
}

Renderer.prototype = new RendererBase();
Renderer.prototype.constructor = Renderer;