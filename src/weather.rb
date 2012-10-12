require 'net/http'

module I
	class Weather
		
		def initialize
			@api_key = '741f676c94234130120910'
		end

		def get
			# data.current_condition[0]
			
			uri = URI('http://free.worldweatheronline.com/feed/weather.ashx?q=san+francisco&format=json&num_of_days=1&key=741f676c94234130120910')
			resp = Net::HTTP.get(uri)
			resp = JSON.parse(resp)

			Net::HTTP.get('example.com', '/index.html')
			{
				:temp => data[:current_condition][0][:temp_F],
				:desc => data[:current_condition][0][:weatherDesc][0][:value],
				:cloud_cover => data[:current_condition][0][:cloudcover]
			}
		end

	end
end