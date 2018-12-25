import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ResponsiveCalendar } from "@nivo/calendar";

const GET_CALENDAR_STATS = gql`
  query($userId: String!) {
    getCalendarStats(userId: $userId) {
      day
      value
    }
  }
`;

const CalendarTimeline = props => {
  return (
    <Query query={GET_CALENDAR_STATS} variables={{ userId: props.userId }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        return (
          <div style={{ height: 500 }}>
            <ResponsiveCalendar
              data={data.getCalendarStats}
              from="2018-10-25"
              to="2018-07-30"
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
            />
          </div>
        );
      }}
    </Query>
  );
};
export default CalendarTimeline;
