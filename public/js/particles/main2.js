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


var canvas, 
	gl, 
	buffer, 
	vertex_shader, fragment_shader, 
	currentProgram,
	vertex_position, 
	parameters = {  start_time  : new Date().getTime(), 
					time        : 0, 
					screenWidth : 0, 
					screenHeight: 0 };

function init(shaders){
	vertex_shader = document.getElementById('vs').textContent;
	fragment_shader = document.getElementById('fs').textContent;

	canvas = document.querySelector( 'canvas' );

	// Initialise WebGL
	try {
		gl = canvas.getContext( 'experimental-webgl' );
	} catch( error ) { }
	if ( !gl ) {
		throw "cannot create webgl context";
	}

	var verts = [
		-0.5, -0.5, 1.0,
		-0.5, -0.5, 1.0,
		0.5, -0.5, 1.0,
		0.5, -0.5, 1.0
	]

	buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW );

	// Create Program

	currentProgram = createProgram( vertex_shader, fragment_shader );

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );
}

function createProgram(vertex, fragment){
	var program = gl.createProgram();

	var vs = createShader( vertex, gl.VERTEX_SHADER );
	var fs = createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER );

	if ( vs == null || fs == null ) return null;

	gl.attachShader( program, vs );
	gl.attachShader( program, fs );

	gl.deleteShader( vs );
	gl.deleteShader( fs );

	gl.linkProgram( program );

	if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {

		console.log( "ERROR:\n" +
		"VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
		"ERROR: " + gl.getError() + "\n\n" +
		"- Vertex Shader -\n" + vertex + "\n\n" +
		"- Fragment Shader -\n" + fragment );

		return null;
	}

	return program;
}

function createShader( src, type ) {
	var shader = gl.createShader( type );

	gl.shaderSource( shader, src );
	gl.compileShader( shader );

	if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

		console.log( ( type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + gl.getShaderInfoLog( shader ) );
		return null;
	}
	return shader;
}

function onWindowResize( event ) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	parameters.screenWidth = canvas.width;
	parameters.screenHeight = canvas.height;

	gl.viewport( 0, 0, canvas.width, canvas.height );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	if ( !currentProgram ) return;

	parameters.time = new Date().getTime() - parameters.start_time;

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	// Load program into GPU

	gl.useProgram( currentProgram );

	// Set values to program variables

	gl.uniform1f( gl.getUniformLocation( currentProgram, 'time' ), parameters.time / 1000 );
	gl.uniform2f( gl.getUniformLocation( currentProgram, 'resolution' ), parameters.screenWidth, parameters.screenHeight );

	// Render geometry

	gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
	gl.vertexAttribPointer( vertex_position, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertex_position );
	gl.drawArrays( gl.TRIANGLES, 0, 6 );
	gl.disableVertexAttribArray( vertex_position );
}

insert_shaders = function(shaders){
	$.each(shaders, function(i, shader){
		$('body').prepend(shader);
	});
}

$(document).ready(function(){
	var shader_loader = new Shader_loader();
	shader_loader.load(['vs', 'fs']);

	$(document).on('shaders_loaded', function(e, shaders){
		insert_shaders(shaders);
		init(shaders);
		animate();
	});
});