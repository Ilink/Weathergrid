<script id="rain_fs" type="x-shader/fragment"> 

	precision highp float;
	uniform float time;
	uniform vec2 resolution;

	void main( void ) {
		vec2 position = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;

		float red = .2-position.y;
		float green = .1-position.y;
		float blue = .2-position.y;
		gl_FragColor = vec4( red, green, blue, 1.0 );
	}

</script>