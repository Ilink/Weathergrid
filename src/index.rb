require 'sinatra/base'

class Ilink < Sinatra::Base
	get "/" do
		"index"
	end
	get "/weather" do
		"weather"
	end
end