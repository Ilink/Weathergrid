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
    var boundaries = {};
    var gl;
    var topleft = [-1,1,-1,1]; // clip space
    var botright = [1,-1,-1,1]; // clip space
    var boundaries;
    canvas = canvas[0];

    function to_clip_space(){
        // implement me!
    }

    function calc_boundaries(){
        var result = vec3.create();
        mat4.multiplyVec3(pMatrixInv, topleft, result);
        boundaries.topleft = result;
        
        result = vec3.create();
        mat4.multiplyVec3(pMatrixInv, botright, result);
        boundaries.botright = result;
    }

    function resize_viewport( canvas ) {
        canvas.width = $(window).width()-4;
        canvas.height = $(window).height()-4;

        screenWidth = canvas.width;
        screenHeight = canvas.height;

        gl.viewport( 0, 0, canvas.width, canvas.height );
        mat4.perspective(45, (canvas.width) / canvas.height, 0.1, 100.0, pMatrix);
        mat4.inverse(pMatrix, pMatrixInv);
        calc_boundaries();
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
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
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

    this.get_boundaries = function(){
        return boundaries;
    }
}