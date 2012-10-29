function Shader_loader(){
	var total = 0, results = {}, rec;

	function load(name){
		$.ajax({
			type: 'get',
			url: 'js/particles/shaders/'+name,
			success: function(data){
				console.log(data);
				collect(name);
				$('document').trigger('loaded_shader', name);
			}
		});
	}

	function collect(name, data){
		results[name] = data;
		rec++;
		if(rec === total){
			$(document).trigger('shaders_loaded', results);
		}
	}

	this.load = function(name){
		if(_.isArray(name)){
			total = name.length;
			$.each(name, function(i, v){
				filename = v + ".shader";
				load(filename);
			});
		} else {
			total = 1;
			name += '.shader';
			load(name);
		}
	};
}