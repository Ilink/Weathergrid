$(document).ready(function(){

	get_coords(function(geo){
		console.log(geo);

		var coords = geo.coords.latitude + "," + geo.coords.longitude;
		var url = "/weather.json?coords="+coords;

		$.ajax({
			type: 'GET',
			url: url,
			success: function(data){
				var weathercolor = new Weathercolor();
				var layout = new Layout({
					h: data.temp,
					s: 1,
					v: data.temp
				}, $('.wrapper'));
				layout.each(function($item, col, row, i){
					$item.css({
						'background-color': weathercolor.make(i, row, col, data)
					});
				});
			}
		});
	});
	
});