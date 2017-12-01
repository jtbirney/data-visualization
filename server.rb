require "sinatra"
require "sinatra/reloader"
require "sinatra/json"
require "json"
require "pry"
require "dotenv/load"
require "httparty"

set :bind, '0.0.0.0'  # bind to all interfaces
set :public_folder, File.join(File.dirname(__FILE__), "public")
set :views, File.dirname(__FILE__) + "/app/views"

get '/' do
  erb :home
end

get '/api/data.json' do
  url = "https://api.usa.gov/crime/fbi/ucr/hc/count/national/bias_name?page=1&per_page=10&output=json&api_key=#{ENV["DATA_GOV_API_KEY"]}"
  response = HTTParty.get(url, format: :plain)
  parsed = JSON.parse(response.parsed_response, :symbolize_names => true)
  results = parsed[:results]
  perceived = {
    black: 92,
    latino: 78,
    native: 75,
    asian: 61,
    white: 55
  }
  population = {
    black: 39908095,
    latino: 54232205,
    native: 3115425,
    asian: 16235305,
    white: 232943055
  }
  actual = {}
  results.each do |result|
    year = result[:year]
    count = result[:count]
    bias_name = result[:bias_name]
    if result[:count] != nil
      if !actual[result[:year]]
        actual[result[:year]] = {
          black: 0,
          latino: 0,
          native: 0,
          asian: 0,
          white: 0
        }
      end
      if bias_name == 'Anti-Black or African American'
        actual[year][:black] += count
      elsif bias_name == 'Anti-Hispanic or Latino'
        actual[year][:latino] += count
      elsif bias_name == 'Anti-American Indian or Alaska Native' || bias_name == 'Anti-Native Hawaiian or Other Pacific Islander'
        actual[year][:native] += count
      elsif bias_name == 'Anti-Asian'
        actual[year][:asian] += count
      elsif bias_name == 'Anti-White'
        actual[year][:white] += count
      end
    end
  end
  actual.each do |key, value|
    value[:black] = (value[:black].to_f / population[:black].to_f * 1000000).to_i
    value[:latino] = (value[:latino].to_f / population[:latino].to_f * 1000000).to_i
    value[:native] = (value[:native].to_f / population[:native].to_f * 1000000).to_i
    value[:asian] = (value[:asian].to_f / population[:asian].to_f * 1000000).to_i
    value[:white] = (value[:white].to_f / population[:white].to_f * 1000000).to_i
  end
  @data = { perceivedData: perceived, actualData: actual }
  content_type :json
  json @data
end
