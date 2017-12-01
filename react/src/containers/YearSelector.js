import React from 'react'

const YearSelector = props => {
  // let years = ['', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015']

  let yearSelects = props.years.map(year => {
    return(<option key={year} value={year}>{year}</option>)
  })

  return(
    <form>
      <label>Select Year</label>
      <select value={props.year} onChange={props.selectYear}>
        {yearSelects}
      </select>
    </form>
  )
}

export default YearSelector
