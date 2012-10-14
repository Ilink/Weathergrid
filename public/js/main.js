$(document).ready(function(){
	
	$.ajax({
		type: 'GET',
		url: '/weather.json',
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