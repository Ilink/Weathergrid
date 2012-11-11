function Engine(canvas, shaders){

    var parameters = {  start_time  : new Date().getTime(), 
                        time        : 0, 
                        screenWidth : 0, 
                        screenHeight: 0 };
    var shaderProgram;
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var triangleVertexPositionBuffer;
    var squareVertexPositionBuffer;
    var gl;
    canvas = canvas[0];

    var geometry = [];

    function resize_viewport( canvas ) {
        canvas.width = $(window).width()-4;
        canvas.height = $(window).height()-4;

        parameters.screenWidth = canvas.width;
        parameters.screenHeight = canvas.height;

        gl.viewport( 0, 0, canvas.width, canvas.height );
    }

    function rotate(deg, matrix, time){
        mat4.rotate(matrix, (time + deg) / 1000, [0, 0, 1]);
    }

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
        } catch (e) {
        }
        if (!gl) {
            console.log("Could not initialise WebGL, sorry :-(");
        }
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            console.log('shader of id '+id+' not found');
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
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

    function initShaders() {
        var fragmentShader = getShader(gl, "sprite_fs");
        var vertexShader = getShader(gl, "sprite_vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        /*
        It looks like this is hooked into the vertex shader
        aVertexPosition
        I presume this is because it sets position info for the verts
        */
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(textureCoordAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    }


    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    function init_buffer(verts){
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        buffer.itemSize = 3;
        buffer.numItems = 4; // hard coded because i only want to draw squares
        return buffer;
    }

    // Textures
    function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function init_texture(texture_name){
        var texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = function() {
            handleLoadedTexture(texture)
        }

        texture.image.src = texture_name;
        return texture;
    }

    function get_texture_coords(){
        return [
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]
    }

    function init_texture_buffer(verts){
        var texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        texture_coord_buffer.itemSize = 2;
        texture_coord_buffer.numItems = 4;
        return texture_coord_buffer;
    }
    //////////////////////

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


    function render() {
        parameters.time = new Date().getTime() - parameters.start_time;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniform1f( gl.getUniformLocation( shaderProgram, 'time' ), parameters.time / 1000 );
        gl.uniform2f( gl.getUniformLocation( shaderProgram, 'resolution' ), parameters.screenWidth, parameters.screenHeight );

        mat4.perspective(45, (canvas.width) / canvas.height, 0.1, 100.0, pMatrix);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        build();
    }

    function insert_shaders(shaders){
        $.each(shaders, function(i, shader){
            $('body').prepend(shader);
        });
    }

    function webGLStart() {        
        initShaders();
        resize_viewport(canvas);
        $(window).on('resize', function(){
            resize_viewport(canvas);
        });
        
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        window.requestAnimationFrame(animate);
    }

    insert_shaders(shaders);
    initGL(canvas);

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

    this.start = function(){
        webGLStart();
    };
}