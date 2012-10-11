require 'sinatra/base'

require 'weather'

class Ilink < Sinatra::Base
	get "/" do
		"index"
	end
	get "/weather" do
		weather = I::Weather.new

	end
end