import React, { Component } from 'react'
import d3, { scaleLinear, max, select } from 'd3'

class Graph extends Component {
  constructor(props){
    super(props)
    this.state = {
      colors: []
    }
    this.createChart = this.createChart.bind(this)
  }

  createChart() {
    const labels = Object.keys(this.props.data)
    const data = Object.values(this.props.data)
    let scaleLabel = `%`
    if (this.props.actual) {
      scaleLabel = ` per 1,000,000`
    }
    const node = select(this.node)
    const dataMax = max(data)
    const horizontalDistribution = this.props.size[0] / 6
    const verticalDistribution = this.props.size[1] / 3
    const yScale = scaleLinear()
       .domain([0, dataMax])
       .range([0, this.props.size[1]])

    node.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')

    node.selectAll('circle')
      .data(data)
      .exit()
      .transition('trans')
        .delay(0)
        .duration(500)
      .remove()

    node.selectAll('circle')
      .data(data)
      .transition('trans')
        .delay(0)
        .duration(500)
      .style('fill', (d,i) => this.state.colors[i])
      .attr('cx', (d,i) => (i - i % 2 + (i % 2) % 2 + 1) * horizontalDistribution)
      .attr('cy', (d,i) => (i % 2 + 1) * verticalDistribution)
      .attr('r', d => yScale(d)/3)

    node.selectAll('text')
      .data(data)
      .enter()
      .append('text')

    node.selectAll('text')
      .data(data)
      .exit()
      .transition('trans')
        .delay(0)
        .duration(500)
      .remove()

    node.selectAll('text')
      .transition('trans')
        .delay(0)
        .duration(500)
      .text((d, i) => `${labels[i].toUpperCase()} - ${d}${scaleLabel}`)
      .attr('x', (d,i) => (i - i % 2 + (i % 2) % 2 + 1) * horizontalDistribution)
      .attr('y', (d,i) => (i % 2 + 1) * verticalDistribution)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
  }

  componentDidMount() {
    let colors = []
    for (let i = 0; i < 5; i++) {
      let newColor = '#'+Math.floor(Math.random()*5109237 + 11667978).toString(16);
      colors.push(newColor)
    }
    this.setState({
      colors: colors
    })
  }

  componentDidUpdate() {
    this.createChart()
  }

  render() {
    return(
      <div>
        <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}></svg>
      </div>
    )
  }
}

export default Graph
