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