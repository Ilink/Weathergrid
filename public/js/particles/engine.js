/*
Engine

The engine handles the boring stuff.
Handles time, basic opengl stuff. Gets the context.
Does the render loop. 
*/


function Engine(canvas){

    var parameters = {  start_time  : new Date().getTime(), 
                        time        : 0, 
                        screenWidth : 0, 
                        screenHeight: 0 };
    var screenHeight, screenWidth;
    var shaderProgram;
    var pMatrix = mat4.create();
    var pMatrixInv = mat4.create();
    var geometry = [];
    var renderers = [];
    var position;
    var gl;
    canvas = canvas[0];

    function to_clip_space(){

    }

    function calc_position(){
        var topleft = [-1,1,-1]; // clip space 
        var result = vec3.create();
        mat4.multiplyVec3(pMatrixInv, topleft);
        var botright = [1, -1, -1, 1];
        var mvMatrix = mat4.create([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,0, -4, -2.62300181388855,-7.774437427520752,1]);
        var mvMatrixInv = mat4.create();
        mat4.inverse(mvMatrix, mvMatrixInv);

        mat4.multiply(pMatrixInv, botright, result);
        // mat4.multiply(pMatrixInv, mvMatrixInv, result);
        // mat4.multiply(result, botright, result);
        console.log(topleft, result);

        // return {
        //     tl: {
        //         x: pMatrixInv * 
        //     }
        // }
    }

    function resize_viewport( canvas ) {
        canvas.width = $(window).width()-4;
        canvas.height = $(window).height()-4;

        screenWidth = canvas.width;
        screenHeight = canvas.height;

        gl.viewport( 0, 0, canvas.width, canvas.height );
        mat4.perspective(45, (canvas.width) / canvas.height, 0.1, 100.0, pMatrix);
        mat4.inverse(pMatrix, pMatrixInv);
        calc_position();
    }

    function initGL(canvas) {
        try {
        	// gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl"));
            gl = canvas.getContext("experimental-webgl");
        } catch (e) {
        }
        if (!gl) {
            console.log("Could not initialise WebGL, sorry :-(");
        }
    }

    initGL(canvas); // get context

    resize_viewport(canvas);
    $(window).on('resize', function(){
        resize_viewport(canvas);
    });

    var timeline = new Timeline(function(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    	$.each(renderers, function(i, renderer){
            var current_program = renderer.get_program();
            gl.useProgram(current_program);
    		renderer.render(parameters.time, 
                {width: screenWidth, height: screenHeight}, 
                pMatrix, pMatrixInv);
    	});
    });

    this.start = function(){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        timeline.start();
    };

    this.add_renderer = function(renderer){
    	renderers.push(renderer);
    };

    this.get_gl = function(){
    	return gl;
    };
}