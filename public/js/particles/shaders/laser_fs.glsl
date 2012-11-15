<script id="rain_fs" type="x-shader/fragment"> 

	precision highp float;
	uniform float time;
	uniform vec2 resolution;
	// varying vec3 pos;
	varying vec2 vertColorOut;


	void main( void ) {
		// vec2 position = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
		vec2 position = vertColorOut.xy;

		float red = position.y;
		float green = position.y;
		float blue = position.y;
		float alpha = sin(3.0*position.y);
		// gl_FragColor = vec4( red, green, blue, alpha );
		gl_FragColor = vec4( 0.0, 0.0, 0.0, alpha );
	}

</script>