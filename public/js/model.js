/*
@coords
{
	lat: float
	lng: float
}
*/

function Model(coords){
	var parsed_coords = parse_coords(coords);
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