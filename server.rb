require "sinatra"
require "sinatra/reloader"
require "sinatra/json"
require "json"
require "pry"

set :bind, '0.0.0.0'  # bind to all interfaces
set :public_folder, File.join(File.dirname(__FILE__), "public")
set :views, File.dirname(__FILE__) + "/app/views"

get '/' do
  erb :home
end

get '/api/data.json' do
  @data = JSON.parse(File.read("data.json"))
  content_type :json
  json @data
end
