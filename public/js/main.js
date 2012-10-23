$(document).ready(function(){
	get_coords(function(geo){

		var model = new Model(geo.coords);
		model.load();
		var colors = new Colors();

		// Initially, we must set up both the initial data and the resize event
		$(document).one('weather', function(e, weather_data){
			colors.update(geo);
			$(window).on('resize', function(){
				colors.update_layout();
			});
			$(document).on('weather', function(e, weather_data){
				colors.update(geo);
			});
		});

	});
});