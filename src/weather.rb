require 'net/http'
require_relative 'util'

# module I
	class Weather

		def initialize(params = Hash.new)
			@api_key = '741f676c94234130120910'
			@params = params
		end

		# this is designed for the worldweatheronline feed, but probably is pretty general
		# should parse out for things i care about like "cloudy" or "rain" or "clear"
		def parse_desc(desc)
			desc.downcase!
			return "rain" if(desc.index "rain")
			return "cloudy" if(desc.index "cloud")
			return "clear" if(desc.index "clear")
			return "snow" if(desc.index "snow")
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

			resp = Net::HTTP.get(uri)
			resp = JSON.parse(resp)

			begin
				Net::HTTP.get('example.com', '/index.html')
				{
					:temp => resp['data']['current_condition'][0]['temp_F'],
					:desc => resp['data']['current_condition'][0]['weatherDesc'][0]['value'],
					:cloud_cover => resp['data']['current_condition'][0]['cloudcover'],
					:visibility => resp['data']['current_condition'][0]['visibility'],
					:wind_speed => resp['data']['current_condition'][0]['windspeedMiles'],
					:desc => parse_desc(resp['data']['current_condition'][0]['weatherDesc'][0]['value'])
				}
			rescue Timeout::Error
				"Errorrrrr timeout!"
			end
		end

	end
# end