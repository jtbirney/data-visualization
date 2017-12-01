import React, { Component } from 'react'
import Graph from './Graph'
import YearSelector from './YearSelector'
import Button from './Button'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      perceivedData: {},
      actualData: {},
      year: '2015',
      width: 1000,
      acutal: true
    }
    this.selectYear = this.selectYear.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
    this.toggleActual = this.toggleActual.bind(this)
  }

  selectYear(event) {
    this.setState({
      year: event.target.value,
      actual: true
    })
  }

  updateDimensions() {
    if (window.innerWidth < 500) {
      this.setState({
        width: 500
      })
    } else {
      let newWidth = window.innerWidth
      this.setState({
        width: newWidth
      })
    }
  }

  toggleActual(event) {
    event.preventDefault()
    this.setState({ actual: !this.state.actual })
  }

  componentDidMount() {
    this.updateDimensions()
    fetch(`/api/data.json`)
      .then(response => response.json())
      .then(body => {
        this.setState({
          actualData: body.actualData,
          perceivedData: body.perceivedData
        })
      })
    window.addEventListener('resize', this.updateDimensions)
  }

  render() {
    let buttonText = "View Actual discrimination"
    if (this.state.actual){
      buttonText = "View Perceived discrimination"
    }

    let data = {}
    if (this.state.actual) {
      data = this.state.actualData[this.state.year]
    } else if (this.state.perceivedData != {}) {
      data = this.state.perceivedData
    }
    let height = Math.round(this.state.width / 2)

    return(
      <div>
        <h1>Crime Data</h1>
        <div className="selectors-container">
          <Button
            handleClick={this.toggleActual}
            text={buttonText.toUpperCase()}
          />
          <YearSelector
            selectYear={this.selectYear}
            year={this.state.year}
            years={Object.keys(this.state.actualData)}
          />
        </div>
        <Graph
          data={data}
          actual={this.state.actual}
          size={[this.state.width, height]}
        />
      </div>
    )
  }
}

export default App
