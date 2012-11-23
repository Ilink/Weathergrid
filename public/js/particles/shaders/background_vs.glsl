<script id="rain_vs" type="x-shader/vertex"> 
 
	attribute vec3 position;
	uniform mat4 uMVMatrix;

	void main(void) {
	    gl_Position = vec4(position, 1.0);
	}

</script>