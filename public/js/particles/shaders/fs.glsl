<script id="fs" type="x-shader/fragment"> 

	precision highp float;
	uniform float time;
	uniform vec2 resolution;

	const float fog_density = 0.05;

	void main( void ) {

		// Fog
		const float LOG2 = 10.442695;
		float z = gl_FragCoord.z / gl_FragCoord.w;
		float fogFactor = exp2( -fog_density * 
						   fog_density * 
						   z * 
						   z * 
						   LOG2 );
		fogFactor = clamp(fogFactor, 0.0, 1.0);

		vec4 fog_color = vec4(1,1,1,1.0);

		// gl_FragColor = mix(gl_Fog.color, finalColor, fogFactor );

		vec2 position = -1.0 + gl_FragCoord.xy / resolution.xy;
		float red = abs( sin( position.y * position.y + time / 5.0 ) );
		float green = abs( sin( position.y * position.y + time / 4.0 ) );
		float blue = abs( sin( position.y * position.y + time / 3.0 ) );

		vec4 final_color;
		final_color.rgba = vec4(1.0,0.0,0.0, 1.0);
		gl_FragColor = mix(fog_color, final_color, fogFactor );

		// gl_FragColor = vec4( red, green, blue, 1.0 );
		// gl_FragColor = vec4( red, green, blue, gl_FragCoord.z/2.0 );
	}

</script>