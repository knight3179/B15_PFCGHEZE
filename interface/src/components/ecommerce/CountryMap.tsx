// react plugin for creating vector maps
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

// Define the component props
interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={{
        initial: {
          fill: "#465FFF",
          r: 4, // Custom radius for markers
        } as any, // Type assertion to bypass strict CSS property checks
      }}
      markersSelectable={true}
      markers={[
        {
          latLng: [37.2580397, -104.657039],
          name: "United States",
          style: {
            fill: "#465FFF",
            borderWidth: 1,
            borderColor: "white",
            stroke: "#383f47",
          },
        },
        {
          latLng: [28.0339, 1.6596],
          name: "Algeria",
          style: {
            fill: "#FF0000", // Red color
            borderWidth: 1,
            borderColor: "red",
            stroke: "#383f47",
          },
        },
        
          {
            latLng: [38.9637, 35.2433],
            name: "Turkey",
            style: {
              fill: "#FF0000",
              borderWidth: 1,
              borderColor: "white",
              stroke: "#383f47",
            },
          },
          {
            latLng: [51.9194, 19.1451],
            name: "Poland",
            style: {
              fill: "#FF0000",
              borderWidth: 1,
              borderColor: "white",
              stroke: "#383f47",
            },
          },
          {
            latLng: [-14.2350, -51.9253],
            name: "Brazil",
            style: {
              fill: "#FF0000",
              borderWidth: 1,
              borderColor: "white",
              stroke: "#383f47",
            },
          },
          {
            latLng: [51.1657, 10.4515],
            name: "Germany",
            style: {
              fill: "#FF0000",
              borderWidth: 1,
              borderColor: "white",
              stroke: "#383f47",
            },
          },
        
                
        {
          latLng: [20.7504374, 73.7276105],
          name: "India",
          style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
        },

        {
          latLng: [53.613, -11.6368],
          name: "United Kingdom",
          style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
        },
        {
          latLng: [-25.0304388, 115.2092761],
          name: "Sweden",
          style: {
            fill: "#465FFF",
            borderWidth: 1,
            borderColor: "white",
            strokeOpacity: 0,
          },
        },
      ]}
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: mapColor || "#D0D5DD",
          fillOpacity: 1,
          fontFamily: "Outfit",
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#465fff",
          stroke: "none",
        },
        selected: {
          fill: "#465FFF",
        },
        selectedHover: {},
      }}
      regionLabelStyle={{
        initial: {
          fill: "#35373e",
          fontWeight: 500,
          fontSize: "13px",
          stroke: "none",
        },
        hover: {},
        selected: {},
        selectedHover: {},
      }}
    />
  );
};

export default CountryMap;
