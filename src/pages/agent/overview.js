import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import Feed from "../../components/FeedItem";
import moment from "moment";
import { clearFix } from "polished";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getFeed from "../../queries/getFeed";
import { Calendar } from "@nivo/calendar";
import Beer from '../../atoms/beers.png'

export default props => (
  <Query
    query={getFeed}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: props.param
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
          {/* <h3>{feed.length} contributions during this year</h3>
          <CalendarWrapper>
            <Calendar
              width={600}
              height={180}
              margin={{
                top: 40,
                right: 10,
                bottom: 10,
                left: 10
              }}
              from="2018-01-01"
              to={new Date()}
              data={feedChart}
            />
          </CalendarWrapper> */}
          <Tagline><Span style={{backgroundImage: `url(${Beer})`}}/>Activities</Tagline>
          <Events>
            {feed.map((ev, i) => (
              <Feed
                scopeId={ev.scope.id}
                image={ev.provider ? ev.provider.image : null}
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
                providerId={ev.provider ? ev.provider.id : null}
                withDelete
                validations={ev.validations}
                primary={
                  <FeedItem>
                    <B>{ev.provider ? ev.provider.name : null}</B>{" "}
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

const Tagline = styled.h3`
letter-spacing: 1px;
margin: 0;
font-size: 12px;
background: #e6ebf0;
height: 26px;
margin-top: -8px;
margin-left: -8px;
margin-right: -8px;
line-height: 30px;
padding: 0 10px;
background: #EBEEF3;
height: 30px;
background-color: #f5f6f7;
border-bottom: 1px solid #dddfe2;
border-radius: 2px 2px 0 0;
font-weight: bold;
padding: 0 10px;
color: #0000004d;
`;
const Span = styled.span`
vertical-align: middle;
  cursor: pointer;
  margin-right: 8px;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: contain;
  vertical-align: sub;
`

const Events = styled.div`
  ${clearFix()};
  position: relative;
`;
const Contribution = styled.div`
  // display: inline-block;
  background: #fff;
  padding: 8px;
  margin: 8px;
  & h3 {
    color: ${props => props.theme.color.p800}
    font-weight: 400;
    letter-spacing: 1px;
  }
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p900};
`;

const B = styled.b`
  font-weight: 500;
  color: #32211b;
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  margin-top: 8px;
  margin-left: 8px;
  overflow-y: overlay;
  min-height: 100vh;
  margin-bottom: -20px;
  ${media.lessThan("medium")`
    display: ${props => (props.isopen ? "none" : "flex")}
  `};
`;
