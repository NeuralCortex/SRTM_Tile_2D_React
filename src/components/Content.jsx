import React, { Component } from "react";
import MapView from "./MapView";
import Control from "./Control";

export class Content extends Component {
  state = {
    colors: [
      { pct: 0.0, colorHex: "0000FF" },
      { pct: 0.5, colorHex: "ADFF2F" },
      { pct: 0.6, colorHex: "9ACD32" },
      { pct: 0.7, colorHex: "FFA500" },
      { pct: 0.8, colorHex: "B8860B" },
      { pct: 0.9, colorHex: "B3801A" },
      { pct: 1.0, colorHex: "FFFFFF" },
    ],
    alpha: false,
    latlon: { lon: 0, lat: 0, show: false },
  };

  setColors = (colors) => {
    this.setState({ colors });
  };

  setAlpha = (alpha) => {
    this.setState({ alpha });
  };

  setLatLon = (latlon) => {
    this.setState({ latlon });
  };

  render() {
    return (
      <div className="w3-orange content">
        <div className="w3-row">
          <MapView
            matrix={this.props.matrix}
            colors={this.state.colors}
            alpha={this.state.alpha}
            latlon={this.state.latlon}
          ></MapView>
          <Control
            colors={this.state.colors}
            setColors={this.setColors}
            setAlpha={this.setAlpha}
            setLatLon={this.setLatLon}
          ></Control>
        </div>
      </div>
    );
  }
}

export default Content;
