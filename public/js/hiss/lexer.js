function Lexer(str){

	function consume(length){
		str = str.substr(length);
	}


	// Matching Keywords
	/////////////////////////////////////


	// Expressions
	function match_indent(){
		var re = /\n(\t*)/;
		var captured = str.match(re);
		
		console.log(captured, captured.length);
		// spaces
		if(!captured) {
			re = /\n( *)/;
			captured = re.exec(str);
			console.log(captured);

			// set spaces as default
		} else {
			// regex matches with tabs, not spaces
			// set tabs as default
		}
		
	}

	match_indent();
}

