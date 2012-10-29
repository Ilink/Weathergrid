require 'sinatra/base'
require 'slim'
require 'json'

require_relative 'weather'

class Ilink < Sinatra::Base

	configure :production, :development do
		enable :logging
	end

	set :views, File.join(File.dirname(__FILE__), '..', 'views')
	set :public_folder, File.join(File.dirname(__FILE__), '..', 'public')

	get "/" do
		
	end

	get "/hiss" do
		slim :hiss, :layout => :hiss_layout
	end

	get "/weather/grid" do
		slim :weathergrid, :layout => :layout
	end

	get "/particles" do
		slim :particles, :layout => :particles_layout
	end

	get "/weather.json" do	
		content_type 'json', :charset => 'utf-8'
		if(params.nil? || !params.has_key?('coords'))
			"needs me some params"
		else
			weather = Weather.new(params)
			(weather.get).to_json
		end
	end

end