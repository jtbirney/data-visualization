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
    let selectedResults = {
      black: 0,
      latino: 0,
      native: 0,
      asian: 0,
      white: 0,
      lgbtq: 0
    }
    this.state.data.forEach(result => {
      if (result.year === this.state.year && result.count !== null) {
        if (result.bias_name === 'Anti-Black or African American') {
          selectedResults.black += result.count
        } else if (result.bias_name === 'Anti-Hispanic or Latino') {
          selectedResults.latino += result.count
        } else if (result.bias_name === 'Anti-American Indian or Alaska Native' || result.bias_name === 'Anti-Native Hawaiian or Other Pacific Islander') {
          selectedResults.native += result.count
        } else if (result.bias_name === 'Anti-Asian') {
          selectedResults.asian += result.count
        } else if (result.bias_name === 'Anti-White') {
          selectedResults.white += result.count
        } else if (result.bias_name.match(/(Gay|Homosexual)/)) {
          selectedResults.lgbtq += result.count
        }
      }
    })
    let perceived = {
      black: 92,
      latino: 78,
      native: 75,
      asian: 61,
      white: 55,
      lgbtq: 90
    }

    return(
      <div>
        <h1>Crime Data</h1>
        <YearSelector
          selectYear={this.selectYear}
        />
        <Graph
          actualData={selectedResults}
          perceivedData={perceived}
          size={[1000,1000]}
        />
      </div>
    )
  }
}

export default App
