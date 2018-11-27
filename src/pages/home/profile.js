import React from "react";
import getFeed from "../../queries/getFeed";
import { Calendar } from "@nivo/calendar";
import Feed from "../../components/FeedItem";
import moment from "moment";
import { clearFix } from "polished";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import styled from "styled-components";
import Beer from '../../atoms/beers.png'

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
          {/* <h3>{feed.length} contributions during this year</h3>
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
          </CalendarWrapper> */}
          <Tagline><Span style={{backgroundImage: `url(${Beer})`}}/>Activities</Tagline>
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
  padding-left: 8px;
  background: #fff;
  padding: 8px;
  margin: 8px;
  border: 1px solid #e6ecf0;
  // & h3 {
  //   font-weight: 400;
  //   letter-spacing: 1px;
  //   color: #36393f59;
  //   letter-spacing: 1px;
  //   margin: 0;
  //   margin-top: 10px;
  //   font-weight: 500;
  //   text-transform: uppercase;
  // }
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
color: #36393f;
-webkit-letter-spacing: 1px;
-moz-letter-spacing: 1px;
-ms-letter-spacing: 1px;
letter-spacing: 1px;
margin: 0;
/* margin-top: 10px; */
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
background: #e6ebf0;
height: 26px;
margin-top: -8px;
margin-left: -8px;
margin-right: -8px;
line-height: 30px;
padding: 0 10px;
`;