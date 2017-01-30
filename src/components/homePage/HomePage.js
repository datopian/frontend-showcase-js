import React from "react";
import {browserHistory} from "react-router";
import "./HomePage.css";

class HomePage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this.state = {value: ''};
  }

  _handleSubmit(event){
    event.preventDefault();
    let publisherName = this.state.value;
    browserHistory.push(`/${publisherName}`);
  }
  _handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="col-md-12">
            <form onSubmit={this._handleSubmit}>
              <div id="custom-search-input" >
                <div className="input-group col-lg-12">
                  <input type="text" className="form-control input-lg" placeholder="Publisher..." value={this.state.value} onChange={this._handleChange} />
                  <span className="input-group-btn">
                    <button className="btn btn-info btn-lg" type="submit">
                        <i className="glyphicon glyphicon-search"/>
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default HomePage;

