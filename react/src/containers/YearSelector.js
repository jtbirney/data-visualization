import React from 'react'

const Selector = props => {

  let valueSelect = props.values.map(value => {
    return(<option key={value} value={value}>{value}</option>)
  })

  return(
    <form>
      <label>Select Year</label>
      <select value={props.value} onChange={props.handleChange}>
        {valueSelect}
      </select>
    </form>
  )
}

export default Selector
