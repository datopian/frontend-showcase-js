import React from 'react'
import vg from 'vega'
const Spinner = require('react-spinkit')

class VegaChart extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // draw a vega chart with initial data and spec
    if(this.props.spec) {
      vg.parse.spec(this.props.spec, (error, chart) => {
          chart({el: `#vega${this.props.idx}`}).update()
        }
      )
    }
  }

  componentDidUpdate() {
    // update the vega chart with new props
    if(this.props.spec) {
      vg.parse.spec(this.props.spec, (error, chart) => {
          chart({el: `#vega${this.props.idx}`}).update()
        }
      )
    }
  }

  render() {
    const divId = `vega${this.props.idx}`
    return (
      <div id={divId} className="PlotlyGraph">
        { !this.props.spec && <Spinner spinnerName="rotating-plane" /> }
      </div>
    )
  }

}

export default VegaChart