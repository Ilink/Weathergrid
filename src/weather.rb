require 'net/http'
require_relative 'util'

class Weather

	def initialize(params = Hash.new)
		@api_key = '741f676c94234130120910'
		@params = params
		@coords = parse_coords(@params[:coords])
	end

	# this is designed for the worldweatheronline feed, but probably is pretty general
	# should parse out for things i care about like "cloudy" or "rain" or "clear"
	def parse_desc(desc)
		desc.downcase!
		return "rain" if(desc.index "rain")
		return "cloudy" if(desc.index "cloud")
		return "clear" if(desc.index "clear")
		return "snow" if(desc.index "snow")
		return "sun" if(desc.index "sun")
	end

	# Season is simple - does not use an astronomical approach
	def get_season(lat)
		month = Time.now.month
		if(month <= 3)
			season = 'winter'
			opposite = 'summer'
		elsif(month > 3 && month <= 6)
			season = 'spring'
			opposite = 'fall'
		elsif(month > 6 && month <= 9)
			season = 'summer'
			opposite = 'winter'
		elsif(month > 9 && month <= 12)
			season = 'fall'
			opposite = 'spring'
		end
		if(lat < 0)
			opposite
		else
			season
		end
	end

	def parse_coords(coord_str)
		coord_split = coord_str.split(',')
		return {
			:lat => coord_split[0].to_f,
			:lng => coord_split[1].to_f
		}
	end

	def get_url
		base = 'http://free.worldweatheronline.com/feed/weather.ashx'
		params = {
			:format => 'json',
			:num_of_days => 1,
			:key => '741f676c94234130120910',
			:q => @params[:coords]
		}

		base = base + I::Util.to_query(params)
	end

	def get
		uri = URI(get_url)

		begin
			resp = Net::HTTP.get(uri)
		rescue Timeout::Error
			{:error => 'Timeout from weather service'}
		end

		resp = JSON.parse(resp)

		begin
			{
				:temp => resp['data']['current_condition'][0]['temp_F'],
				:desc => resp['data']['current_condition'][0]['weatherDesc'][0]['value'],
				:cloud_cover => resp['data']['current_condition'][0]['cloudcover'],
				:visibility => resp['data']['current_condition'][0]['visibility'],
				:wind_speed => resp['data']['current_condition'][0]['windspeedMiles'],
				:desc => parse_desc(resp['data']['current_condition'][0]['weatherDesc'][0]['value']),
				:desc_orig => resp['data']['current_condition'][0]['weatherDesc'][0]['value'],
				:season => get_season(@coords[:lat])
			}
		rescue NoMethodError
			{:error => 'No weather data for that lng and lat. Or something else went wrong.'}
		end
	end

end