/*
Renderer
Takes an open gl context

This COULD actually have more use from the Engine to handle the transform and perspective
matrices. 
*/

// function CompositeRenderer(gl, shaders, textures, blurShaders){
function CompositeRenderer(gl, properties){
    var shaders = properties.shaders;
    var textures = properties.textures;
    var blurShaders = properties.compositeShaders.blurShaders;
    var imageShader = properties.compositeShaders.imageShader;

    RendererBase.call(this, gl);
    var parameters = {  
        start_time: new Date().getTime(),    
        time: 0
    };
    var self = this;
    var mvMatrix = mat4.create();
    // var pMatrix = mat4.create();
    var pMatrix;
    var texture_builder = new Texture_builder(gl);
    var shaderProgramBuilder = new ShaderProgramBuilder(gl);
    var compositor = new BlurCompositor(gl, [blurShaders, imageShader]);
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
    var gradient_buffer = texture_builder.init_buffer(gradient_coords);
    var shaderProgram = shaderProgramBuilder.build(shaders);


    function setup_shaders(shaderProgram) {
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(textureCoordAttribute);

        shaderProgram.vertColor = gl.getAttribLocation(shaderProgram, "vertColor");
        gl.enableVertexAttribArray(vertColor);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");        
    }

    function setup_composite_shaders(programs){
        $.each(programs, function(i, program){
            setup_shaders(program);
        });
    }

    // the defaults
    function _build(program, geo){
        mat4.identity(mvMatrix); // reset the position for each piece of geometry
        mat4.translate(mvMatrix, geo.trans);
        mat4.rotate(mvMatrix, 40, [0,0,1], mvMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, gradient_buffer);
        // This is out of range, for some reason
        gl.vertexAttribPointer(shaderProgram.vertColor, gradient_buffer.itemSize, gl.FLOAT, false, 0, 0); 
        self.setDefaultUniforms(program, pMatrix, mvMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, geo.buffer);
        gl.vertexAttribPointer(program.vertexPositionAttribute, 
            geo.buffer.itemSize, gl.FLOAT, false, 0, 0);
    }

    function build(){
        $.each(geometry, function(i, geo){
            var compositeTextureResult = compositor.compose(function(program){
                _build(program, geo);
            }, geo);

            gl.useProgram(shaderProgram);
            _build(shaderProgram, geo);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, geo.buffer.numItems);
        });
    }

    setup_shaders(shaderProgram);
    setup_composite_shaders(compositor.programs);

    this.render = function(time, dim, perspective, perspectiveInv) {
        parameters.time = new Date().getTime() - parameters.start_time;

        pMatrix = perspective;
        pMatrixInv = perspectiveInv;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        build();
    };

    this.add_geo = function(verts, mat, texture){
        var geo = {
            verts: verts,
            buffer: self.initGeoBuffer(verts),
            trans: mat
        };
        
        if(typeof texture !== 'undefined'){
            geo.texture = texture_builder.init(texture);
            geo.texture_buffer = texture_builder.init_buffer(texture_coords);
        }
        geometry.push(geo);
        return geo;
    };

    this.get_program = function(){
        return shaderProgram;
    };

}

CompositeRenderer.prototype = new RendererBase();
CompositeRenderer.prototype.constructor = CompositeRenderer;