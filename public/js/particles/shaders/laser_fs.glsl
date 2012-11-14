<script id="rain_fs" type="x-shader/fragment"> 

	precision highp float;
	uniform float time;
	uniform vec2 resolution;
	// varying vec3 pos;
	varying vec2 vertColorOut;


	void main( void ) {
		// vec2 position = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
		vec2 position = vertColorOut.xy;

		float red = position.y*2.0;
		float green = position.y*1.5;
		float blue = position.y*2.0;
		float alpha = position.y*2.0;
		gl_FragColor = vec4( red, green, blue, alpha );
	}

</script>