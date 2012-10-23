function Colors(){
	var weathercolor = new Weathercolor();
	var layout = new Layout($('.wrapper'), 5, {width: 60, height: 100});
	var data;

	function setup_colors(){
		layout.each(function($item, col, row, i){
			$item.css({
				'background-color': weathercolor.make(i, row, col, data)
			});
		});
	}

	function prepare_data(data){
		data.temp = Number(data.temp);
		data.cloud_cover = Number(data.cloud_cover);
		data.wind_speed = Number(data.wind_speed);
		data.visibility = Number(data.visibility);
		return data;
	}

	this.update = function(new_data){
		data = prepare_data(new_data);
		layout.update();
		setup_colors();
	}

	this.update_layout = function(){
		layout.update();
		setup_colors();
	}
}