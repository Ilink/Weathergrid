/*
Renderer
Takes an open gl context

This COULD actually have more use from the Engine to handle the transform and perspective
matrices. 
*/

function Renderer(gl, shaders, textures){
    var parameters = {  
        start_time: new Date().getTime(),    
        time: 0
    };
    var shaderProgram;
    var mvMatrix = mat4.create();
    // var pMatrix = mat4.create();
    var pMatrix;
    var texture_builder = new Texture_builder(gl);
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

    function setMatrixUniforms() {
        // console.log(pMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    function get_shader(shader_src, type){
        var shader;
        if(type === 'fs'){
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if(type === 'vs'){
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else return null;

        gl.shaderSource(shader, shader_src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    // Link shaders and set uniforms / attributes
    function setup_shaders() {
        var fragmentShader = get_shader(shaders.fs, 'fs');
        var vertexShader = get_shader(shaders.vs, 'vs');

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log("Could not initialise shaders");
        }

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

    // Change my name?
    function init_buffer(verts){
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        buffer.itemSize = 3;
        buffer.numItems = 4; // hard coded because i only want to draw squares
        return buffer;
    }

    function build(){
        $.each(geometry, function(i, geo){
            mat4.identity(mvMatrix); // reset the position for each piece of geometry
            mat4.translate(mvMatrix, geo.trans);
            mat4.rotate(mvMatrix, 40, [0,0,1], mvMatrix);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, gradient_buffer);
            // out of range?
            gl.vertexAttribPointer(vertColor, gradient_buffer.itemSize, gl.FLOAT, false, 0, 0); 

            setMatrixUniforms();

            // Textures
            if(typeof geo.texture !== 'undefined'){
                gl.bindBuffer(gl.ARRAY_BUFFER, geo.texture_buffer);
                gl.vertexAttribPointer(shaderProgram.textureCoordAttribute,  geo.texture_buffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, geo.texture);
                gl.uniform1i(shaderProgram.samplerUniform, 0);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, geo.buffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, geo.buffer.itemSize, gl.FLOAT, false, 0, 0); 


            gl.drawArrays(gl.TRIANGLE_STRIP, 0, geo.buffer.numItems);
        });
    }

    setup_shaders();

    this.render = function(time, dim, perspective, perspectiveInv) {
        parameters.time = new Date().getTime() - parameters.start_time;

        gl.uniform1f( gl.getUniformLocation( shaderProgram, 'time' ), time / 1000 );
        gl.uniform2f( gl.getUniformLocation( shaderProgram, 'resolution' ), dim.width, dim.height );

        pMatrix = perspective;
        pMatrixInv = perspectiveInv;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        build();
    };

    this.add_geo = function(verts, mat, texture){
        var geo = {
            verts: verts,
            buffer: init_buffer(verts),
            trans: mat
        }
        
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