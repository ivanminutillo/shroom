import React from "react";
import getFeed from "../../queries/getFeed";
import { Calendar } from "@nivo/calendar";
import Feed from "../../components/FeedItem";
import moment from "moment";
import { clearFix } from "polished";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import styled from "styled-components";


export default props => (
  <Query
    query={getFeed}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: props.providerId
    }}
  >
    {({ loading, error, data, client, refetch }) => {
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
        );
      let feed = data.viewer.agent.agentEconomicEvents;
      let filteredIntents = [];
      if (props.event !== "all") {
        filteredIntents = feed.filter(i => i.action === props.event);
      } else {
        filteredIntents = feed;
      }
      let feedChart = feed.map(f => ({
        day: f.start,
        value: 1
      }));

      return (
        <Contribution>
          <h3>{feed.length} contributions during this year</h3>
          <CalendarWrapper>
            <Calendar
              width={600}
              height={180}
              margin={{
                top: 40,
                right: 10,
                bottom: 10,
                left: 40
              }}
              from="2018-01-01"
              to={new Date()}
              data={feedChart}
            />
          </CalendarWrapper>
          <Tagline>Activities</Tagline>
          <Events>
            {feed.map((ev, i) => (
              <Feed
                scopeId={ev.scope.id}
                image={ev.provider.image}
                commitmentId={
                  ev.inputOf
                    ? ev.inputOf.id
                    : ev.outputOf
                      ? ev.outputOf.id
                      : null
                }
                key={i}
                id={ev.id}
                loggedUserId={props.providerId}
                providerId={ev.provider.id}
                withDelete
                validations={ev.validations}
                primary={
                  <FeedItem>
                    <B>{ev.provider.name}</B>{" "}
                    {ev.action +
                      " " +
                      ev.affectedQuantity.numericValue +
                      " " +
                      ev.affectedQuantity.unit.name +
                      " of "}
                    <i>{ev.affects.resourceClassifiedAs.name}</i>
                  </FeedItem>
                }
                secondary={ev.note}
                date={moment(ev.start).format("DD MMM")}
              />
            ))}
          </Events>
        </Contribution>
      );
    }}
  </Query>
);


const Events = styled.div`
  ${clearFix()};
  position: relative;
`;
const Contribution = styled.div`
  display: inline-block;
  margin-left: 16px;
  & h3 {
    color: ${props => props.theme.color.p800}
    font-weight: 400;
    letter-spacing: 1px;
  }
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p900}
`;

const B = styled.b`
  font-weight: 500;
  color: #32211B;
`;

const CalendarWrapper = styled.div`
height: 300px;
border: 1px solid #14141430;
height: 150px;
border-radius: 3px;
width: 620px;
margin: 0 auto;
margin-top: 8px;
`;

const Tagline = styled.h3`
  font-weight: 500;
  padding-bottom: 8px;
  margin-top: 20px;
  border-bottom: 1px solid #f0f0f030;
  margin-bottom: 10px;
  font-size: 13px;
`;