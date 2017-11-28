import React, { Component } from 'react'
import d3, { scaleLinear, max, select } from 'd3'

class Graph extends Component {
  constructor(props){
    super(props)
    this.state = {
      actual: true,
      data: this.props.actualData,
      colors: []
    }
    this.createChart = this.createChart.bind(this)
    this.changeColor = this.changeColor.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillReceiveProps() {
    let colors = []
    let numOfColors = this.props.actualData.length
    for (let i = 0; i < numOfColors; i++) {
      let newColor = '#'+Math.floor(Math.random()*5109237 + 11667978).toString(16);
      colors.push(newColor)
    }
    this.setState({
      data: this.props.actualData,
      colors: colors
    })
  }

  componentDidUpdate() {
    this.createChart()
  }

  createChart() {
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
      .style('fill', (d,i) => this.state.colors[i])
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
