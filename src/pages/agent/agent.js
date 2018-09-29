import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import { Icons, Feed } from "oce-components/build";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getFeed from "../../queries/getFeed";
import { Query } from "react-apollo";
import media from 'styled-media-query'
import SmartSentence from "../../components/smartSentence";
import moment from 'moment'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  ${media.lessThan('medium')`
    display: ${props => props.isOpen ? 'none' : 'flex'}
  `}
`;

const Header = styled.div`
  position: relative;
  flex: 0 0 auto;
  height: 50px;
  width: 620px;
  margin: 0 auto;
  color: ${props => props.theme.color.p100};
  ${clearFix()};
  ${media.lessThan('medium')`
    width: 100%;
  `}
`;

const Content = styled.div`
  contain: strict;
  flex: 1 1 auto;
  will-change: transform;
  padding: 8px;
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
  min-height: 100vh;
`;

const HeaderLeft = styled.div`
  float: left;
  ${clearFix()};
  ${media.lessThan('medium')`
    margin-left: 8px;
  `}
`;

const HeaderSpan = styled.div`
  float: left;
  vertical-align: sub;
  margin-top: 14px;
  margin-left: 0px;
  cursor:pointer;
  display: none;
  ${media.lessThan('medium')`
    display: block;
    margin-right: 8px;
  `}
`;

const HeaderRight = styled.div`
  float: right;
  ${clearFix()};
  ${media.lessThan('medium')`
    margin-right: 8px;
  `}
`;

const Span = styled.div`
  margin-top: 16px;
  margin-right: 0px;
  cursor: pointer;
  float: left;
  margin-left: 16px;
`;

const Img = styled.div`
  float: left;
  background: url(${props => props.src});
  border-radius: ${props => props.theme.avatar.radius};
  width: ${props => props.theme.avatar.mini};
  height: ${props => props.theme.avatar.mini};
  margin-top: 11px;
  margin-left: 0px;
  background-size: cover;
  background-color: ${props => props.theme.color.p600};
`;
const Title = styled.h2`
  float: left;
  margin-left: 8px;
  line-height: 50px;
`;

const Overview = styled.div`
  flex: 1;
  width: 620px;
  margin: 0 auto;
  margin-top: 16px;
  background: ${props => props.theme.color.p600};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  ${media.lessThan('medium')`
  width: 100%;
  `}
`;

const FeedHeader = styled.div`
  height: 40px;
  border-bottom: 1px solid #f0f0f020;
`;
const HeaderTitle = styled.h3`
  color: ${props => props.theme.color.p300};
  line-height: 40px;
  margin-left: 8px;
`;

const FeedList = styled.div`
  margin-top: 8px;
  margin-bottom: 60px;
  padding: 0;
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color:  ${props => props.theme.color.p100};
`;

const B = styled.b`
  text-decoration: underline;
  font-weight: 500;
  color: ${props => props.theme.color.p100};
`;

const Agent = props => {
  return (
    <Query
      query={getFeed}
      variables={{
        token: localStorage.getItem("oce_token"),
        id: props.id ? props.id : Number(props.match.params.id)
      }}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <LoadingMini />;
        if (error)
          return (
            <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
          );
        return (
          <Wrapper isOpen={props.isOpen}>
            <Header>
              <HeaderLeft>
                <HeaderSpan onClick={props.toggleLeftPanel}><Icons.Left width='22' height='22' color='#99ADC6' /></HeaderSpan>
                <Img src={`${data.viewer.agent.image}`} />
                <Title>{data.viewer.agent.name}</Title>
              </HeaderLeft>
              <HeaderRight>
                <Span>
                  <Icons.Search width="20" height='20' color="#99ADC6" />
                </Span>
                <Span onClick={props.togglePanel}>
                  <Icons.Sidebar width="22" color="#99ADC6" />
                </Span>
              </HeaderRight>
            </Header>
            <Content>
              <Inside>
                  <SmartSentence 
                    providerId={props.providerId}
                    scopeId={props.id === props.providerId ? props.providerId : props.match.params.id}
                  />
                <Overview>
                  <FeedHeader>
                    <HeaderTitle>Recent Activities</HeaderTitle>
                  </FeedHeader>
                  <FeedList>
                    {data.viewer.agent.agentEconomicEvents.map((ev, i) => (
                      <Feed
                        image={ev.provider.image}
                        key={i}
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
                  </FeedList>
                </Overview>
              </Inside>
            </Content>
          </Wrapper>
        );
      }}
    </Query>
  );
};

export default Agent;
