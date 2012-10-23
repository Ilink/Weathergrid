/*
@coords
{
	lat: float
	lng: float
}
*/

var Model = function(coords){
	var parsed_coords = join(coords, ',');
	var url = "/weather.json?coords="+parsed_coords;

	this.load = function(){
		$.ajax({
			type: 'GET',
			url: url,
			success: function(weather_data){
				$(document).trigger('weather', weather_data);
			}
		});
	}
}