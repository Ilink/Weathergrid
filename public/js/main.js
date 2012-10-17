$(document).ready(function(){

	function prepare_data(data){
		data.temp = Number(data.temp);
		data.cloud_cover = Number(data.cloud_cover);
		data.wind_speed = Number(data.wind_speed);
		data.visibility = Number(data.visibility);
	}
	
	get_coords(function(geo){
		console.log(geo);

		var coords = geo.coords.latitude + "," + geo.coords.longitude;
		var url = "/weather.json?coords="+coords;

		$.ajax({
			type: 'GET',
			url: url,
			success: function(data){
				prepare_data(data);
				var weathercolor = new Weathercolor();
				var layout = new Layout($('.wrapper'), 5, {width: 60, height: 100});

				function setup_colors(){
					layout.each(function($item, col, row, i){
						$item.css({
							'background-color': weathercolor.make(i, row, col, data)
						});
					});
				}

				setup_colors(layout, weathercolor);

				$(window).on('resize', function(){
					layout.update();
					setup_colors(layout);
				});
			}
		});
	});
	
});