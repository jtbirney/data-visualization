require "sinatra"
require "sinatra/reloader"
require "sinatra/json"
require "json"
require "pry"
require "dotenv/load"
require "httparty"
require "csv"

set :bind, '0.0.0.0'  # bind to all interfaces
set :public_folder, File.join(File.dirname(__FILE__), "public")
set :views, File.dirname(__FILE__) + "/app/views"

population = {
  black: 39908095,
  latino: 54232205,
  native: 3115425,
  asian: 16235305,
  white: 232943055
}

get '/' do
  erb :home
end

get '/api/housing-data.json' do
  csv = CSV.read("housing_data.csv", headers: true)
  hashed_data = csv.map do |d|
    if d["Calendar Year Filed"] == "2015"
      d.to_hash
    end
  end
  hashed_data.compact!
  totals = {
    black: 0,
    latino: 0,
    native: 0,
    asian: 0,
    white: 0
  }
  hashed_data.each do |state|
    totals[:black] += state["Number of Filed Cases with a Black or African-American Race Basis"].to_i
    totals[:black] += state["Number of Filed Cases with a Black and White Race Basis"].to_i
    totals[:latino] += state["Number of Filed Cases with an Hispanic National Origin Basis"].to_i
    totals[:native] += state["Number of Filed Cases with a Hawaiian or Pacific-Islander Race Basis"].to_i
    totals[:native] += state["Number of Filed Cases with a Native American Race Basis"].to_i
    totals[:native] += state["Number of Filed Cases with a Native American and Black  Race Basis"].to_i
    totals[:native] += state["Number of Filed Cases with a Native American and White Race Basis"].to_i
    totals[:asian] += state["Number of Filed Cases with an Asian Race Basis"].to_i
    totals[:asian] += state["Number of Filed Cases with an Asian and White Race Basis"].to_i
    totals[:white] += state["Number of Filed Cases with a White Race Basis"].to_i
  end
  percentage = {
    black: (totals[:black].to_f / population[:black].to_f * 1000000).to_i,
    latino: (totals[:latino].to_f / population[:latino].to_f * 1000000).to_i,
    native: (totals[:native].to_f / population[:native].to_f * 1000000).to_i,
    asian: (totals[:asian].to_f / population[:asian].to_f * 1000000).to_i,
    white: (totals[:white].to_f / population[:white].to_f * 1000000).to_i
  }

  @data = percentage
  content_type :json
  json @data
end

get '/api/eeoc-data.json' do
  data = File.read("2015_eeoc_data.csv")
  csv_data = data.gsub(';', ',')
  csv = CSV.parse(csv_data, headers: true)
  hashed_data = csv.map { |d| d.to_hash }
  hash = hashed_data[0]

  totals = {
    black: hash["BLKT10"],
    latino: hash["HISPT10"],
    native: hash["AIANT10"],
    asian: hash["ASIANT10"],
    white: hash["WHT10"]
  }
  percentage = {
    black: (totals[:black].to_f / population[:black].to_f * 1000).to_i,
    latino: (totals[:latino].to_f / population[:latino].to_f * 1000).to_i,
    native: (totals[:native].to_f / population[:native].to_f * 1000).to_i,
    asian: (totals[:asian].to_f / population[:asian].to_f * 1000).to_i,
    white: (totals[:white].to_f / population[:white].to_f * 1000).to_i
  }

  @data = percentage
  content_type :json
  json @data
end

get '/api/perceived_data.json' do
  perceived = {
    black: 92,
    latino: 78,
    native: 75,
    asian: 61,
    white: 55
  }
  @data = perceived
  content_type :json
  json @data
end

get '/api/hate_crime_data.json' do
  url = "https://api.usa.gov/crime/fbi/ucr/hc/count/national/bias_name?page=1&per_page=10&output=json&api_key=#{ENV["DATA_GOV_API_KEY"]}"
  response = HTTParty.get(url, format: :plain)
  parsed = JSON.parse(response.parsed_response, :symbolize_names => true)
  results = parsed[:results]
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
  @data = actual["2015"]
  content_type :json
  json @data
end
