import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import LiquidFillGauge from "react-liquid-gauge";

const GET_WIN_RATIO = gql`
  query($userId: String!) {
    getWinRatio(userId: $userId)
  }
`;
const startColor = "#6495ed";
const endColor = "#dc143c";
const radius = 200;
const interpolate = interpolateRgb(startColor, endColor);

const WinRatio = props => {
  return (
    <Query query={GET_WIN_RATIO} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const value = data.getWinRatio;
        const fillColor = interpolate(value / 100);
        const gradientStops = [
          {
            key: "0%",
            stopColor: color(fillColor)
              .darker(0.5)
              .toString(),
            stopOpacity: 1,
            offset: "0%"
          },
          {
            key: "50%",
            stopColor: fillColor,
            stopOpacity: 0.75,
            offset: "50%"
          },
          {
            key: "100%",
            stopColor: color(fillColor)
              .brighter(0.5)
              .toString(),
            stopOpacity: 0.5,
            offset: "100%"
          }
        ];
        return (
          <LiquidFillGauge
            {...props}
            width={radius * 2}
            height={radius * 2}
            value={value}
            percent="%"
            textSize={1}
            textOffsetX={0}
            textOffsetY={0}
            textRenderer={({ value, width, height, textSize, percent }) => {
              value = Math.round(value);
              const radius = Math.min(height / 2, width / 2);
              const textPixels = (textSize * radius) / 2;
              const valueStyle = {
                fontSize: textPixels
              };
              const percentStyle = {
                fontSize: textPixels * 0.6
              };

              return (
                <tspan>
                  <tspan className="value" style={valueStyle}>
                    {value}
                  </tspan>
                  <tspan style={percentStyle}>{percent}</tspan>
                </tspan>
              );
            }}
            riseAnimation
            waveAnimation
            waveFrequency={2}
            waveAmplitude={1}
            gradient
            gradientStops={gradientStops}
            circleStyle={{
              fill: fillColor
            }}
            waveStyle={{
              fill: fillColor
            }}
            textStyle={{
              fill: color("#444").toString(),
              fontFamily: "Arial"
            }}
            waveTextStyle={{
              fill: color("#fff").toString(),
              fontFamily: "Arial"
            }}
          />
        );
      }}
    </Query>
  );
};

export default WinRatio;
