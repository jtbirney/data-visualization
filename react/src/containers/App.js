import React, { Component } from 'react'
import Graph from './Graph'
// import Selector from './YearSelector'
import Button from './Button'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      scaleLabel: '',
      width: 1000
    }
    this.updateDimensions = this.updateDimensions.bind(this)
    this.toggleActual = this.toggleActual.bind(this)
    this.showPerceived = this.showPerceived.bind(this)
    this.showHateCrimes = this.showHateCrimes.bind(this)
    this.showEmployment = this.showEmployment.bind(this)
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

  showPerceived(event) {
    event.preventDefault()
    fetch(`/api/perceived_data.json`)
      .then(response => response.json())
      .then(body => {
        this.setState({
          data: body,
          scaleLabel: '%'
        })
      })
  }

  showHateCrimes(event) {
    event.preventDefault()
    fetch(`/api/hate_crime_data.json`)
      .then(response => response.json())
      .then(body => {
        this.setState({
          data: body,
          scaleLabel: ' / 1mil'
        })
      })
  }

  showEmployment(event) {
    event.preventDefault()
    fetch(`/api/eeoc-data.json`)
      .then(response => response.json())
      .then(body => {
        this.setState({
          data: body,
          scaleLabel: ' / 1k'
        })
      })
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }

  render() {
    let height = Math.round(this.state.width / 2)

    return(
      <div>
        <h1>Crime Data</h1>
        <div className="selectors-container">
          <Button
            handleClick={this.showPerceived}
            text={"Perceived discrimination".toUpperCase()}
          />
          <Button
            handleClick={this.showHateCrimes}
            text={"Hate Crimes".toUpperCase()}
          />
          <Button
            handleClick={this.showEmployment}
            text={"Employment Discrimination".toUpperCase()}
          />
        </div>
        <Graph
          data={this.state.data}
          actual={this.state.actual}
          scaleLabel={this.state.scaleLabel}
          size={[this.state.width, height]}
        />
      </div>
    )
  }
}

export default App
