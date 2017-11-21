import React, { Component } from 'react'
import d3, { scaleLinear, max, select } from 'd3'

class Graph extends Component {
  constructor(props){
    super(props)
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount() {
    this.createBarChart()
  }
  componentDidUpdate() {
    this.createBarChart()
  }
  createBarChart() {
    const node = this.node
    const dataMax = max(this.props.data)
    const yScale = scaleLinear()
       .domain([0, dataMax])
       .range([0, this.props.size[1]])
    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')

    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .exit()
      .remove()

    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .style('fill', '#fe9922')
      .attr('y', (d,i) => i * 20)
      .attr('x', 0)
      .attr('width', d => yScale(d)/2)
      .attr('height', 20)
  }

  render() {
    return <svg ref={node => this.node = node} width={1000} height={700}>
    </svg>
  }
}

export default Graph
