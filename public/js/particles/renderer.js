/*
Renderer
Takes an open gl context

This COULD actually have more use from the Engine to handle the transform and perspective
matrices. 
*/

function Renderer(gl, shaders, textures){
    RendererBase.call(this, gl);
    var parameters = {  
        start_time: new Date().getTime(),    
        time: 0
    };
    var self = this;
    var mvMatrix = mat4.create();
    // var pMatrix = mat4.create();
    var pMatrix;
    var geometry = [];
    var pMatrixInv;
    var textureCoordAttribute;
    var vertColor;
    var texture_coords = [
        0.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ];
    var gradient_coords =  [
        0.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ];
    
    var shaderProgram = buildShaderProgram(gl, shaders);

    function setup_shaders() {
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(textureCoordAttribute);

        vertColor = gl.getAttribLocation(shaderProgram, "vertColor");
        gl.enableVertexAttribArray(vertColor);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    }

    function build(){
        $.each(geometry, function(i, geo){
            mat4.identity(mvMatrix); // reset the position for each piece of geometry
            mat4.translate(mvMatrix, geo.trans);
            mat4.rotate(mvMatrix, 40, [0,0,1], mvMatrix);
            
            if(vertColor > 0)
                gradientBuffer.set();

            self.setDefaultUniforms(shaderProgram, pMatrix, mvMatrix);

            // Textures
            if(typeof geo.texture !== 'undefined'){
                geo.texture.set();
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, geo.buffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geo.buffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, geo.buffer.numItems);
        });
    }

    setup_shaders();
    var gradientBuffer = new Buffer(gl, gradient_coords, 2, vertColor);

    this.render = function(time, dim, perspective, perspectiveInv) {
        // parameters.time = new Date().getTime() - parameters.start_time;
        // gl.uniform1f( gl.getUniformLocation( shaderProgram, 'time' ), time / 1000 );
        // gl.uniform2f( gl.getUniformLocation( shaderProgram, 'resolution' ), dim.width, dim.height );

        pMatrix = perspective;
        pMatrixInv = perspectiveInv;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        build();
    };

    this.add_geo = function(verts, mat, textureName){
        var geo = {
            verts: verts,
            buffer: self.initGeoBuffer(verts),
            trans: mat
        }
        
        if(typeof textureName !== 'undefined'){
            geo.texture = new Texture(gl, textureName, gl.getUniformLocation(shaderProgram, "uSampler"), gl.getAttribLocation(shaderProgram, "aTextureCoord"));
        }
        geometry.push(geo);
        return geo;
    };

    this.get_program = function(){
        return shaderProgram;
    };

}

Renderer.prototype = new RendererBase();
Renderer.prototype.constructor = Renderer;