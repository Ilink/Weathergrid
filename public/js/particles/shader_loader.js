/*
Shader Loader
Loads shader files via AJAX.
*/

function Shader_loader(){
	var total = 0, results = {}, rec = 0;

	function load(name){
		$.ajax({
			type: 'get',
			url: 'js/particles/shaders/'+name,
			success: function(data){
				collect(name, data);
			}
		});
	}

	function collect(name, data){
		results[name] = data;
		rec++;
		console.log('collect', name, rec);
		if(rec === total){
			$(document).trigger('shaders_loaded', results);
		}
	}

	this.load = function(name){
		rec = 0;
		if(_.isArray(name)){
			total = name.length;
			$.each(name, function(i, v){
				filename = v + ".glsl";
				load(filename);
			});
		} else {
			total = 1;
			name += '.glsl';
			load(name);
		}
	};
}