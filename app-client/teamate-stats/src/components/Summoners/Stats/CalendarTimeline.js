import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ResponsiveCalendar } from "@nivo/calendar";
import ReactLoading from "react-loading";
import "./graphs.css";
import { Alert, Divider } from "antd";

const GET_CALENDAR_STATS = gql`
  query($userId: String!, $summonerName: String!, $server: String!) {
    getCalendarStats(
      userId: $userId
      summonerName: $summonerName
      server: $server
    ) {
      maxDay
      minDay
      timeline {
        day
        value
      }
    }
  }
`;

const CalendarTimeline = props => {
  return (
    <Query
      query={GET_CALENDAR_STATS}
      variables={{
        userId: props.userId,
        summonerName: props.summonerName,
        server: props.server
      }}
    >
      {({ loading, error, data }) => {
        if (loading)
          return (
            <ReactLoading
              type={"bubbles"}
              color={"#0a253e"}
              height={100}
              width={100}
              className="loader-graph"
            />
          );
        if (error)
          return (
            <Alert
              message=" An Error Occurred"
              description="Please refresh the page"
              type="error"
            />
          );
        return (
          <div style={{ height: 450 }}>
            <ResponsiveCalendar
              data={data.getCalendarStats.timeline}
              from={data.getCalendarStats.minDay}
              to={data.getCalendarStats.maxDay}
              emptyColor="#eeeeee"
              colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
              margin={{
                top: 100,
                right: 30,
                bottom: 60,
                left: 30
              }}
              yearSpacing={40}
              monthBorderWidth={6}
              monthBorderColor="#ffffff"
              monthLegendOffset={10}
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "row",
                  translateY: 36,
                  itemCount: 4,
                  itemWidth: 34,
                  itemHeight: 36,
                  itemDirection: "top-to-bottom"
                }
              ]}
              tooltip={data => {
                return (
                  <div>
                    <Divider> {data.day} </Divider>
                    <Divider>Play {data.value} times</Divider>
                  </div>
                );
              }}
            />
          </div>
        );
      }}
    </Query>
  );
};
export default CalendarTimeline;
