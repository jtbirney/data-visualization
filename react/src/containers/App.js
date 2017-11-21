import React, { Component } from 'react'
import Graph from './Graph'
import YearSelector from './YearSelector'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      year: '2015'
    }
    this.selectYear = this.selectYear.bind(this)
  }

  selectYear(year) {
    this.setState({ year: year })
  }

  componentDidMount() {
    // fetch(`https://api.usa.gov/crime/fbi/ucr/hc/count/national/bias_name?page=1&per_page=10&output=json&api_key=${ENV["DATA_GOV_API_KEY"]}`)
    fetch(`/api/data.json`)
      .then(response => response.json())
      .then(body => {
        this.setState({ data: body.results})
      })
  }

  render() {
    let selectedResults = this.state.data.filter(result => result.year === this.state.year && result.count !== null)
    let results = selectedResults.map(result => {
      return(
        result.count
      )
    })
    let labels = selectedResults.map(result => {
      return(
        <p key={result.bias_name} className="label">{result.bias_name}</p>
      )
    })
    return(
      <div>
        <h1>Crime Data</h1>
        <YearSelector
          selectYear={this.selectYear}
        />
        <br/>
        <div className="graph-container">
          <div className="label-container">
            {labels}
          </div>
          <Graph data={results} size={[1000,700]}></Graph>
        </div>
      </div>
    )
  }
}

export default App
