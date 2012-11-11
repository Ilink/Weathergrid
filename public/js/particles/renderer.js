/*
Renderer
Takes an open gl context
*/

function Renderer(gl, shaders, textures){
    var parameters = {  
        start_time: new Date().getTime(),    
        time: 0
    };
    var shaderProgram;
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var texture_builder = new Texture_builder(gl);
    var geometry = [];

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    function setup_shader(shader_element){
        var str = "";
        var k = shader_element.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        console.log(shaderScript.type);
        if (shaderScript.type == "x-shader/fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    // Link shaders and set uniforms / attributes
    function setup_shaders() {
        var fragmentShader = get_shader(gl, shaders.fs);
        var vertexShader = get_shader(gl, shaders.vs);

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(textureCoordAttribute);

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

    function animate(){
        render();
        requestAnimationFrame(animate);
    }

    function build(){
        $.each(geometry, function(i, geo){
            mat4.identity(mvMatrix);
            mat4.translate(mvMatrix, geo.trans);

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

    this.render = function() {
        parameters.time = new Date().getTime() - parameters.start_time;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniform1f( gl.getUniformLocation( shaderProgram, 'time' ), parameters.time / 1000 );
        gl.uniform2f( gl.getUniformLocation( shaderProgram, 'resolution' ), screenWidth, screenHeight );

        mat4.perspective(45, (canvas.width) / canvas.height, 0.1, 100.0, pMatrix);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        build();
    }

    this.add_geo = function(verts, mat, texture){
        var geo = {
            verts: verts,
            buffer: init_buffer(verts),
            trans: mat
        }
        if(typeof texture !== 'undefined'){
            geo.texture = init_texture(texture);
            geo.texture_buffer = init_texture_buffer(get_texture_coords());
        }
        geometry.push(geo);
        return geo;
    };

}