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
	var data;

	function prepare_data(data){
		data.temp = Number(data.temp);
		data.cloud_cover = Number(data.cloud_cover);
		data.wind_speed = Number(data.wind_speed);
		data.visibility = Number(data.visibility);
		return data;
	}

	this.load = function(){
		$.ajax({
			type: 'GET',
			url: url,
			success: function(weather_data){
				data = prepare_data(weather_data);
				console.log(data);
				$(document).trigger('weather', data);
			}
		});
	}
}