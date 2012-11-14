<script id="rain_vs" type="x-shader/vertex"> 
 
	attribute vec3 position;

	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;

	// attribute vec2 quadCoordIn;
	// varying vec2 quadCoord;
	varying vec3 pos;

	void main(void) {
	    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
	    pos = position;
	}

</script>