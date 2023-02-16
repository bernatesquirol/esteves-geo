import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import DeckGL, { BitmapLayer } from "deck.gl";
import GeoTIFF from "geotiff";
import { EditableGeoJsonLayer, DrawLineStringMode } from "nebula.gl";
import { StaticMap } from "react-map-gl";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA";

const initialViewState = {
  longitude: 2.1686,
  latitude: 41.3874,
  zoom: 12
};

function GeometryEditor() {
  const [features, setFeatures] = React.useState({
    type: "FeatureCollection",
    features: []
  });
  const [mode, setMode] = React.useState(() => DrawLineStringMode);
  const [selectedFeatureIndexes] = React.useState([]);
  useEffect(() => {}, []);
  const layer = new EditableGeoJsonLayer({
    // id: "geojson-layer",
    data: features,
    mode,
    selectedFeatureIndexes,

    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
    }
  });
  const download = (myData) => {
    // https://codesandbox.io/s/bianzbennynebulabitmapmapdraw-jwekk
    const fileName = "my-file";
    const json = JSON.stringify(myData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };
  const bitmapLayer = new BitmapLayer({
    bounds: [
      ...[initialViewState.longitude, initialViewState.latitude],
      ...[initialViewState.longitude, initialViewState.latitude]
    ],
    image:
      "https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/sf-districts.png",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    desaturate: 0,
    transparentColor: [0, 0, 0, 0],
    tintColor: [255, 255, 255]
  });
  return (
    <>
      <DeckGL
        initialViewState={initialViewState}
        controller={{
          doubleClickZoom: false
        }}
        layers={[layer]}
        getCursor={layer.getCursor.bind(layer)}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
      <div
        style={{ position: "absolute", bottom: 0, right: 0, color: "white" }}
      >
        {/* <button
          onClick={() => setMode(() => DrawLineStringMode)}
          style={{ background: mode === DrawLineStringMode ? "#3090e0" : null }}
        >
          Line
        </button> */}
        <button onClick={() => download(features)}>Download</button>
        {/* <button
          onClick={() => setMode(() => DrawPolygonMode)}
          style={{ background: mode === DrawPolygonMode ? "#3090e0" : null }}
        >
          Polygon
        </button> */}
      </div>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<GeometryEditor />, rootElement);
