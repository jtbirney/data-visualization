import React, { Component } from 'react'
import d3, { scaleLinear, max, select } from 'd3'

class Graph extends Component {
  constructor(props){
    super(props)
    this.state = {
      actual: true,
      data: this.props.actualData,
      colors: ["#fe9922", "pink"]
    }
    this.createActualChart = this.createActualChart.bind(this)
    // this.createPercievedChart = this.createPercievedChart.bind(this)
    this.changeColor = this.changeColor.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
  }

  componentWillReceiveProps() {
    this.setState({ data: this.props.actualData })
  }

  componentDidUpdate() {
    this.createActualChart()
  }

  createActualChart() {
    const node = this.node
    const dataMax = max(this.state.data)
    const yScale = scaleLinear()
       .domain([0, dataMax])
       .range([0, this.props.size[1]])
    select(node)
      .selectAll('circle')
      .data(this.state.data)
      .enter()
      .append('circle')

    select(node)
      .selectAll('circle')
      .data(this.state.data)
      .exit()
      .transition('trans')
        .delay(0)
        .duration(2000)
      .remove()

    select(node)
      .selectAll('circle')
      .data(this.state.data)
      .transition('trans')
        .delay(0)
        .duration(2000)
      .style('fill', (d,i) => this.state.colors[i % 2])
      .attr('cx', (d,i) => i * 150 + 100)
      .attr('cy', (d,i) => i % 2 * 150 + 100)
      .attr('r', d => yScale(d)/10)
  }

  changeColor() {
    if (this.state.actual) {
      this.setState({
        actual: false,
        data: Object.values(this.props.perceivedData),
        color: "pink"
      })
    } else {
      this.setState({
        actual: true,
        data: this.props.actualData,
        color: "#fe9922"
      })
    }
  }

  handleClick(event) {
    event.preventDefault()
    this.changeColor()
  }

  render() {
    let buttonText = "Show Actual"
    if (this.state.actual){
      buttonText = "Show Perceived"
    }

    return(
      <div>
        <div>
          <button onClick={this.handleClick}>{buttonText}</button>
        </div>
        <svg ref={node => this.node = node} width={1000} height={1000}></svg>
      </div>
    )
  }
}

export default Graph
