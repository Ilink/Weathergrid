/**
 * Provides requestAnimationFrame in a cross browser way.
 * paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
window.requestAnimationFrame = window.requestAnimationFrame || ( function() {
    return  window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(  callback, element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
})();

/*
Engine
I think each engine should represent a complete webgl "program"
Mostly I just mean that each engine has its own shaders.
I dont know about sharing contexts or anything. or how it should
be done yet. we will see!


*/

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

    // something like this:
    // var geometry = [{
    //     verts: [0,1..],
    //     buffer: buffer,
    //     shader: shader
    // }];


    function resize_viewport( canvas ) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

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
        var fragmentShader = getShader(gl, "fs");
        var vertexShader = getShader(gl, "vs");

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

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }


    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    function initBuffers() {
        triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        var vertices = [
             0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        triangleVertexPositionBuffer.itemSize = 3;
        triangleVertexPositionBuffer.numItems = 3;


        vertices = [
             1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];
        squareVertexPositionBuffer = init_buffer(vertices);
        // squareVertexPositionBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        // squareVertexPositionBuffer.itemSize = 3;
        // squareVertexPositionBuffer.numItems = 4;
    }

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

            if(i === 0) {
                rotate(0.1, mvMatrix, parameters.time);
            }
            setMatrixUniforms();
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

        mat4.perspective(45, canvas.width / canvas.height, 0.1, 100.0, pMatrix);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        build();

        // mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
        // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        // gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        // setMatrixUniforms();
        // gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

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
        
        // initBuffers(); // buffers are now added from "add_geo"

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        window.requestAnimationFrame(animate);
    }

    insert_shaders(shaders);
    initGL(canvas);

    this.add_geo = function(verts, mat){
        var geo = {
            verts: verts,
            buffer: init_buffer(verts),
            trans: mat
        }
        geometry.push(geo);
        return geo;
    };

    this.start = function(){
        webGLStart();
    };
}

var geo = {
    rectangle: function(width, height){
        return [
            0.0,    0.0,        0.0,
            width,  0.0,        0.0,
            0.0,    height,     0.0,
            width,  height,     0.0
        ];
    }
}

function Rain(){
    var geo = [];
    var tmat;
    
    for(var i = 0; i < 100; i++){
        tmat = [i, 0.0, 0];
        verts = geo.rectangle(0.05, 0.5);
        var _geo = engine.add_geo(geo.rectangle(0.05, 0.5), tmat);
        // _geo.velocity =
        geo.push(_geo);
    }
}


$(document).ready(function(){
    var shader_loader = new Shader_loader();
    shader_loader.load(['vs', 'fs']);

    $(document).on('shaders_loaded', function(e, shaders){
        var engine = new Engine($('canvas'), shaders);

        // var tmat = mat4.create();
        var tmat = [-1.5, 0.0, -7.0];

        var geo1 = engine.add_geo([
             1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ], tmat);

        tmat = [1.5, 0.0, -8.0];
        var geo2 = engine.add_geo([
             0.0,  0.0,  0.0,
             0.2,  0.0,  0.0,
             0.0,  1.0,  0.0,
             0.2,  1.0,  0.0
        ], tmat);

        for(var i = 0; i < 40; i++){
            tmat = [i/10, 0.0, -8.0];
            engine.add_geo(geo.rectangle(0.05, 0.5), tmat);
            // var geo2 = engine.add_geo([
            //      1.0,  1.0,  0.0,
            //     -1.0,  1.0,  0.0,
            //      1.0, -1.0,  0.0,
            //     -1.0, -1.0,  0.0
            // ], tmat);
        }


        // window.setInterval(function(){
        //     geo2.trans[0] += 0.1;
        // }, 1000);

        // console.log(geo1.buffer.itemSize,geo2.buffer.itemSize);

        engine.start();
    });
});