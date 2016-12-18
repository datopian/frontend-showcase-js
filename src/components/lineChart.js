import React from "react"
import axios from "axios"
import DataPackage from "../js/dataPackage.js"


class Chart extends React.Component {

  constructor(props) {

    super(props)

    this.state = {myVegaSpec: {}} //just an initial state

  }

  componentDidMount() {

    let _this = this

    this.serverRequest = axios
      .get(DataPackageJsonUrl)
      .then((result) => {

        let dpJson = result.data
        let dp = new DataPackage(dpJson)
        let myVegaSpec = dp.spec
        console.log(myVegaSpec)
        _this.setState({
          myVegaSpec: myVegaSpec //updating state inside of promise
        })

      })

  }

  componentWillUnmount() {
    this.serverRequest.abort() //finishing request
  }

  componentDidUpdate() {
    vg.embed("#vis", {mode: "vega-lite", spec: this.state.myVegaSpec})
  }

  render() {
    return (
      <div id="vis"></div>
    )
  }
}

export default Chart
