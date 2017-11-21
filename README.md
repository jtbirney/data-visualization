# README

This is an exercise to start learning the D3 library.
Data is from Data.gov. You will need your own API key in .env to access data from their API.

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
For the recipe search function to work, you will need an API key from Data.gov `https://developer.edamam.com/`
The API key can be stored in a .env file as follows
```
DATA_GOV_API_KEY=<YOUR_API_ID_HERE>
```
