<script id="fs" type="x-shader/fragment"> 

	precision highp float;
	uniform float time;
	uniform vec2 resolution;

	void main( void ) {
		vec2 position = -1.0 + gl_FragCoord.xy / resolution.xy;
		float red = abs(sin(time));
		// float red = abs( sin( position.y * position.y + time / 5.0 ) );
		float green = abs( sin( position.y * position.y + time / 4.0 ) );
		float blue = abs( sin( position.y * position.y + time / 3.0 ) );
		gl_FragColor = vec4( red, green, blue, 1.0 );

		// gl_FragColor = vec4( 0.0,0.5,0.0, 1.0 );
	}

</script>