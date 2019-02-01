import urllib from 'url'

import React, { PropTypes } from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import ReactHover from 'react-hover'

import * as dprender from 'datapackage-render'
import PlotlyChart from '../components/dataPackageView/PlotlyChart'
import VegaChart from '../components/dataPackageView/VegaChart'
import HandsOnTable from '../components/dataPackageView/HandsOnTable'

export class MultiViews extends React.Component {
  constructor(props) {
    super(props)
    // TODO: what is the point of state? Why not just use props?
    this.state = {
      // we stub some basic fields to ensure render works ...
      dataPackage: this.props.dataPackage,
      hoverText: 'Copy to clipboard',
      index: this.props.idx
    }
  }

  copied() {
    this.setState({
      hoverText: 'Copied!'
    })
    setTimeout(() => {
      this.setState({
        hoverText: 'Copy to clipboard'
      })
    }, 1500)
  }


  render() {
    let dp = this.state.dataPackage
    let viewComponents
    if(dp.views) {
      viewComponents = dp.views.map((view, idx) => {
        // check if the view is not a preview
        if (!view.datahub || !(view.datahub.type === 'preview')) {
          // first let's fix up recline views ...
          if (view.type == 'Graph') { // it's a recline view
            view = dprender.convertReclineToSimple(view)
          }
          let compiledView = dprender.compileView(view, dp)
          let readyView
          let firstValue = {}
          let lastValue = {}
          if(compiledView.resources[0]._values) {
            firstValue = compiledView.resources[0]._values[0]
            lastValue = compiledView.resources[0]._values[compiledView.resources[0]._values.length-1]
          }
          switch (view.specType) {
            case 'simple': // convert to plotly then render
              let spec = {}
              if(compiledView.resources[0]._values) {
                spec = dprender.simpleToPlotly(compiledView)
              }
              readyView = <PlotlyChart data={spec.data} layout={spec.layout} idx={this.state.index || idx} key={idx} />
              break
            case 'vega': // render VegaChart
              let vegaSpec = dprender.vegaToVega(compiledView)
              readyView = <VegaChart spec={vegaSpec} idx={this.state.index || idx} key={idx} />
              break
            case 'table': // render handsontable
              let htSpec = dprender.handsOnTableToHandsOnTable(compiledView)
              return <HandsOnTable spec={htSpec} idx={this.state.index + 'v' || idx + 'v'} key={idx} />
          }
          const windowHref = window.location.href
          const windowHrefParts = urllib.parse(windowHref)
          const baseUrl = windowHrefParts.protocol + '//' + windowHrefParts.host
            + windowHrefParts.path.split('/').slice(0,3).join('/') + '/'
          const viewPath = `view/${idx}`
          let sharedUrl = urllib.resolve(baseUrl, viewPath)
          // If base url is a full URL (with /v/ revision number) then convert it to params:
          if (windowHref.match(/\/[^/]+\/[^/]+\/v\/[0-9]+/)) {
            const revision = parseInt(windowHrefParts.path.split('/')[4])
            sharedUrl += `?v=${revision}`
          }
          const iframe = `<iframe src="${sharedUrl}" width="100%" height="475px" frameborder="0"></iframe>`
          let pathToDataset = dp.datahub ? `https://datahub.io/${dp.datahub.owner}/${dp.name}` : 'https://datahub.io'
          const tracker = `watermark-${baseUrl}`
          pathToDataset += `?source=${tracker}`
          const homePagePath = `https://datahub.io?source=${tracker}`
          const optionsCursorTrueWithMargin = {
            followCursor: true,
            shiftX: -5,
            shiftY: 20
          }

          return (
            <div>
              <div className="tab-border" style={{ display: 'none' }}>
                    <div className="row ">
                        <div className="col-sm-4  text-center">
                            <h2 id="global">{lastValue.value || lastValue[1]}</h2>
                            <h4>{"GLOBAL CO₂ LEVEL"}</h4>
                        </div>
                        <div className="col-sm-4  text-center">
                            <h2 id="change">{(lastValue.value - firstValue.value).toFixed(2)}</h2>
                            <h4>{"CHANGE"}</h4>
                        </div>
                        <div className="col-sm-4  text-center">
                            <h2 id="change-in-percentage">{((lastValue.value - firstValue.value)/firstValue.value*100).toFixed(2)}</h2>
                            <h4>{"CHANGE (%)"}</h4>
                        </div>
                    </div>
                </div>
              {readyView}
              <div className="datahub-meta">
                <a className="dataset-name" href={pathToDataset} target="_blank">
                  {dp.name}
                </a>
                <span className="meta-text"> powered by ❒ </span>
                <a className="datahub-home" href={homePagePath} target="_blank">
                  DataHub
                </a>
              </div>
              <div className="share-and-embed">

                <span className="copy-text">Share:</span>
                <input value={sharedUrl} className="copy-input" />
                <ReactHover options={optionsCursorTrueWithMargin}>
                  <ReactHover.Trigger type='trigger'>
                    <CopyToClipboard text={sharedUrl}
                      onCopy={() => this.copied()}>
                        <button className={'copy-button trigger shared-' + sharedUrl}>
                          <i className={'fa fa-clipboard trigger shared-' + sharedUrl} aria-hidden="true"></i>
                        </button>
                    </CopyToClipboard>
                  </ReactHover.Trigger>
                  <ReactHover.Hover type='hover'>
                    <span className="hover-text">{this.state.hoverText}</span>
                  </ReactHover.Hover>
                </ReactHover>

                <span className="copy-text">Embed:</span>
                <input value={iframe} className="copy-input" />
                <ReactHover options={optionsCursorTrueWithMargin}>
                  <ReactHover.Trigger type='trigger'>
                    <CopyToClipboard text={iframe}
                      onCopy={() => this.copied()}>
                        <button className={'copy-button trigger embed-' + sharedUrl}>
                          <i className={'fa fa-clipboard trigger embed-' + sharedUrl} aria-hidden="true"></i>
                        </button>
                    </CopyToClipboard>
                  </ReactHover.Trigger>
                  <ReactHover.Hover type='hover'>
                    <span className="hover-text">{this.state.hoverText}</span>
                  </ReactHover.Hover>
                </ReactHover>

              </div>
            </div>
          )
        }
      })
    }
    return <div>{viewComponents}</div>
  }
}

export default MultiViews
