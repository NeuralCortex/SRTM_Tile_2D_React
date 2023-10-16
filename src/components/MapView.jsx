import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Rectangle, Polyline } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { Toast } from "primereact/toast";

export class MapView extends Component {
  state = {
    lat: 10,
    lon: 50,
    tileName: "",
  };

  pad = (num, size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  };

  getTileNameSRTM = (lon, lat) => {
    let tileName = "";

    let lod = Math.floor(lon);
    let lad = Math.floor(lat);

    if (lad >= 0) {
      tileName += "N";
    } else {
      tileName += "S";
    }
    tileName += this.pad(Math.abs(lad), 2);

    if (lod >= 0) {
      tileName += "E";
    } else {
      tileName += "W";
    }
    tileName += this.pad(Math.abs(lod), 3);

    tileName += ".hgt";

    return tileName;
  };

  getPercentFromHeight = (min, max, height) => {
    let erg = 0;
    erg = ((height - min) / (max - min)) * 100.0;
    if (min === max && min === 0) {
      return 0;
    }
    return erg / 100.0;
  };

  hexToRgb = (hex) => {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return {
      r,
      g,
      b,
    };
  };

  getColorForPercentage = (pct, self) => {
    let colors = self.props.colors;
    let percentColors = [];
    for (let i = 0; i < colors.length; i++) {
      let col = self.hexToRgb(colors[i].colorHex);
      percentColors[i] = {
        pct: colors[i].pct,
        color: {
          r: col.r,
          g: col.g,
          b: col.b,
        },
      };
    }
    for (var i = 1; i < percentColors.length - 1; i++) {
      if (pct < percentColors[i].pct) {
        break;
      }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    let color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
    };
    return "rgba(" + [color.r, color.g, color.b, 1.0].join(",") + ")";
  };

  getTileType = () => {
    let type = "";
    if (this.props.matrix !== null) {
      let size = this.props.matrix.size;
      if (size === 1201) {
        type = "SRTM-3 | ";
      }
      if (size === 3601) {
        type = "SRTM-1 | ";
      }
    }
    return type;
  };

  getTileHeight = (lat, lng) => {
    let height = "";
    if (this.props.matrix !== null) {
      let { rect, size, srtm } = this.props.matrix;

      let ul = rect[0];
      let lr = rect[1];

      if (
        lat > lr[0] &&
        lat + 1 / size < ul[0] &&
        lng > ul[1] &&
        lng + 1 / size < lr[1]
      ) {
        let latFloor = Math.floor(lat);
        let lngFloor = Math.floor(lng);

        let diffLat = lat - latFloor;
        let diffLng = lng - lngFloor;

        let i = Math.floor(size * diffLat);
        let j = Math.floor(size * diffLng);

        if (size === 1201) {
          height = " | " + srtm[i][j] + " m";
        }
        if (size === 3601) {
          height = " | " + srtm[i][j] + " m";
        }
      } else {
        height = "";
      }
    }
    return height;
  };

  render() {
    let self = this;

    function DisplayPosition({ map }) {
      const [position, setPosition] = useState(() => map.getCenter());

      const onMove = useCallback((e) => {
        setPosition(e.latlng);
      }, []);

      useEffect(() => {
        map.on("mousemove", onMove);
        return () => {
          map.off("mousemove", onMove);
        };
      }, [map, onMove]);

      return (
        <div className="w3-container w3-blue w3-margin-top w3-margin-bottom w3-padding">
          <FontAwesomeIcon icon="fa-solid fa-map" className="w3-margin-right" />
          Map Viewer Latitude: {position.lat.toFixed(6)} Longitude:{" "}
          {position.lng.toFixed(6)}{" "}
          <label className="w3-right">
            {self.getTileType()}

            {self.getTileNameSRTM(position.lat, position.lng)}
            {self.getTileHeight(position.lat, position.lng)}
          </label>
        </div>
      );
    }

    function DrawTiles() {
      let map = useMap();
      let rectArray = [];

      if (self.props.matrix != null) {
        let { rect, min, max, srtm, size } = self.props.matrix;

        let stepsVer = Math.floor(size / 50);
        let stepsHor = Math.floor(size / 50);

        let lat = rect[1][0];
        let lon = rect[0][1];

        let key = 0;

        for (let i = 0; i < size - stepsVer; i += stepsVer) {
          for (let j = 0; j < size - stepsHor; j += stepsHor) {
            let ver = i / size;
            let hor = j / size;

            let latStart = lat + ver;
            let latEnd = lat + ver + stepsVer / size;

            let lonStart = lon + hor;
            let lonEnd = lon + hor + stepsHor / size;

            let r = [
              [latStart, lonStart],
              [latEnd, lonEnd],
            ];

            let height = srtm[i][j];

            if (min < 0) {
              min = 0;
            }

            let color = self.getColorForPercentage(
              self.getPercentFromHeight(min, max, height),
              self
            );

            if (map.getBounds().overlaps(r)) {
              rectArray.push(
                <Rectangle
                  key={key}
                  bounds={r}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fill: true,
                    fillOpacity: self.props.alpha ? 0.5 : 1.0,
                  }}
                />
              );
              key++;
            }
          }
        }
        map.fitBounds(rect);
      }

      return rectArray.map((rect) => rect);
    }

    function RectOne() {
      let map = useMap();
    
      let fakeBounds = [
        [0, 0],
        [0, 0],
      ];
      const [bounds, setBounds] = useState(fakeBounds);

      const onMove = useCallback((e) => {
        if (self.props.matrix !== null) {
          let { size, rect } = self.props.matrix;

          let { lat, lng } = e.latlng;

          let ul = rect[0];
          let lr = rect[1];

          if (
            lat > lr[0] &&
            lat + 1 / size < ul[0] &&
            lng > ul[1] &&
            lng + 1 / size < lr[1]
          ) {
            let latFloor = Math.floor(lat);
            let lngFloor = Math.floor(lng);

            let diffLat = lat - latFloor;
            let diffLng = lng - lngFloor;

            let latSize = size * diffLat;
            let lngSize = size * diffLng;

            let latStart = latFloor + Math.floor(latSize) / size;
            let lngStart = lngFloor + Math.floor(lngSize) / size;

            let bounds = [
              [latStart, lngStart + 1 / size],
              [latStart + 1 / size, lngStart],
            ];

            setBounds(bounds);
          }
        } else {
          let fake = [
            [0, 0],
            [0, 0],
          ];
          setBounds(fake);
        }
      }, []);

      useEffect(() => {
        map.on("mousemove", onMove);
        return () => {
          map.off("mousemove", onMove);
        };
      }, [map, onMove]);

      return (
        <Rectangle
          bounds={bounds}
          pathOptions={{
            color: "Black",
          }}
        />
      );
    }

    function Marker() {
      const redOptions = { color: "black" };
      const lengthHor = 0.05;
      const lengthVer = 0.03;

      if (self.props.latlon !== null) {
        let { lat, lon, show } = self.props.latlon;
        console.log(self.props.latlon);
        if (show) {
          let horLine = [
            [lat, lon - lengthHor],
            [lat, lon + lengthHor],
          ];
          let verLine = [
            [lat - lengthVer, lon],
            [lat + lengthVer, lon],
          ];
          return (
            <div>
              <Polyline pathOptions={redOptions} positions={horLine} />
              <Polyline pathOptions={redOptions} positions={verLine} />
            </div>
          );
        }
      }
    }

    function wrongFormatCheck() {
      if (self.props.matrix !== null) {
        let { size } = self.props.matrix;
        if (size === 1201 || size === 3601) {
          return (
            <div>
              <DrawTiles />
              <RectOne />
            </div>
          );
        }
        else{
          self.toast.show({
            severity: "error",
            summary: "Error Message",
            detail: "Wrong SRTM-File format.",
          });
        }
      }
    }

    function FinalMap() {
      const [map, setMap] = useState();

      const displayMap = useMemo(
        () => (
          <MapContainer
            center={[50.65935313570456, 10.665137544640139]}
            zoom={5}
            style={{ height: "calc(100vh - 157.48px - 31px - 5*16px)" }}
            scrollWheelZoom={true}
            ref={setMap}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {wrongFormatCheck()}
            <Marker />
          </MapContainer>
        ),
        []
      );

      return (
        <div>
          {map ? <DisplayPosition map={map} /> : null}
          {displayMap}
        </div>
      );
    }

    return (
      <div
        className="w3-col w3-margin-left w3-margin-right"
        style={{ width: "calc(85% - 2*16px)" }}
      >
        <Toast ref={(el) => (this.toast = el)} />
        <FinalMap />
      </div>
    );
  }
}

export default MapView;
