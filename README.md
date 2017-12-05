# README

This is an exercise to start learning the D3 library.
Data is from Data.gov. If you want to access the data directly, you will need your own API key in .env to access data from their API. However, the data has been saved into csv and json files in this repository.

Ruby v. 2.3.3
Sinatra 2.0
React v 16.0.0
React Router v. 3.0.2

## Getting Started
Run the following commands in terminal. (This app uses yarn. If you do not have yarn installed, run `$ brew install yarn`)
```
$ git clone git@github.com/jtbirney/data-visualization.git
$ bundle install
$ ruby server.rb
```
And in a separate tab
```
$ yarn install
$ yarn start
```

#### API key
You don't need an api key to run this code. However, to access the data directly from Data.gov, you will need an API key from Data.gov `https://api.data.gov/signup/`
The API key can be stored in a .env file as follows
```
DATA_GOV_API_KEY=<YOUR_API_ID_HERE>
```
