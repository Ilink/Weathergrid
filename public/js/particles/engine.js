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
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var geometry = [];
    var renderers = [];
    var gl;
    canvas = canvas[0];

    function resize_viewport( canvas ) {
        canvas.width = $(window).width()-4;
        canvas.height = $(window).height()-4;

        screenWidth = canvas.width;
        screenHeight = canvas.height;

        gl.viewport( 0, 0, canvas.width, canvas.height );
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
    	$.each(renderers, function(i, renderer){
            var current_program = renderer.get_program();
            gl.useProgram(current_program);
    		renderer.render(parameters.time, {width: screenWidth, height: screenHeight});
    	});
    });

    this.start = function(){
        gl.clearColor(0.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        timeline.start();
    };

    this.add_renderer = function(renderer){
    	renderers.push(renderer);
    }

    this.get_gl = function(){
    	return gl;
    }
}