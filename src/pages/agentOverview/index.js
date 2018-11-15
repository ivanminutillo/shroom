import React from "react";
import styled from "styled-components";
import Header from "../agent/header";
import media from "styled-media-query";
import setInbox from "../../mutations/setInbox";
import Feed from "../../components/FeedItem";
import moment from "moment";
import { clearFix } from "polished";
import setCommitted from "../../mutations/setCommitted";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getCommitments from "../../queries/getCommitments";
import { PropsRoute } from "../../helpers/router";
import Todo from "../../components/todo";
import Sidebar from "../../components/sidebar/sidebar";
import setMatched from "../../mutations/setMatched";
import { compose, withState, withHandlers } from "recompose";
import getFeed from "../../queries/getFeed";
import { Calendar } from "@nivo/calendar";

export default compose(
  withState("event", "onEvent", "all"),
  withHandlers({
    handleEvent: props => val => props.onEvent(val.value)
  })
)(props => {
  return (
    <Body>
      <Sidebar
        profile="true"
        isopen={props.isopen}
        param={props.match.params.id}
        location={props.location}
      />
      <Wrapper isopen={props.isopen}>
        <Content>
          <Inside>
            <Query
              query={getFeed}
              variables={{
                token: localStorage.getItem("oce_token"),
                id: props.match.params.id
              }}
            >
              {({ loading, error, data, client, refetch }) => {
                if (loading) return <LoadingMini />;
                if (error)
                  return (
                    <ErrorMini
                      refetch={refetch}
                      message={`Error! ${error.message}`}
                    />
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
                  <Overview>
                    <Header
                      image={data.viewer.agent.image}
                      name={data.viewer.agent.name}
                      toggleLeftPanel={props.toggleLeftPanel}
                      togglePanel={props.togglePanel}
                      handleEvent={props.handleEvent}
                    />
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
                            left: 10
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
                  </Overview>
                );
              }}
            </Query>
          </Inside>
        </Content>
      </Wrapper>
    </Body>
  );
});

const Events = styled.div`
  ${clearFix()};
  position: relative;
`;
const Contribution = styled.div`
  display: inline-block;
  margin-left: 20px;
  & h3 {
    font-weight: 500;
    letter-spacing: 1px;
  }
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: #f0f0f0bd;
`;

const B = styled.b`
  font-weight: 500;
  color: ${props => props.theme.color.p100};
`;

const CalendarWrapper = styled.div`
  margin-top: 8px;
  height: 300px;
  border: 1px solid #f0f0f030;
  padding: 8px;
  border-radius: 2px;
  height: 150px;
  width: 620px;
  background: #f0f8ffe6;
  border-radius: 3px;
`;

const Img = styled.div`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 100px;
  background-size: cover;
  background-color: #494f5c;
  vertical-align: middle;
`;

const Tagline = styled.h3`
  font-weight: 300;
  padding-bottom: 8px;
  margin-top: 20px;
  border-bottom: 1px solid #f0f0f030;
  margin-bottom: 10px;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  ${media.lessThan("medium")`
    display: ${props => (props.isopen ? "none" : "flex")}
  `};
`;

const Content = styled.div`
  contain: strict;
  flex: 1 1 auto;
  will-change: transform;
  display: flex;
  flex: 1;
`;

const Inside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: center;
  position: relative;
  overflow-y: overlay;
  position: relative;
`;

const Overview = styled.div`
  flex: 1;
  ${media.lessThan("medium")`
  width: 100%;
  `};
`;
