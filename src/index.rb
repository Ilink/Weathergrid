require 'sinatra/base'
require 'slim'
require 'json'

require_relative 'weather'

class Ilink < Sinatra::Base

  set :views, File.join(File.dirname(__FILE__), '..', 'views')
  set :public_folder, File.join(File.dirname(__FILE__), '..', 'public')

	get "/" do
		"index"
	end

	get "/weather/grid" do
		slim :weathergrid, :layout => :layout
	end

	get "/weather.json" do
		content_type 'json', :charset => 'utf-8'
		weather = Weather.new
		(weather.get).to_json
		# "hello"
	end

end