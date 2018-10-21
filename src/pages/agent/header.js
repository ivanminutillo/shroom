import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { clearFix } from "polished";
import { Icons } from "oce-components/build";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getAgentInfo from "../../queries/getAgentInfo";
import { Query } from "react-apollo";

const Header = styled.div`
  position: relative;
  height: 50px;
  color: ${props => props.theme.color.p100};
  background: #2F3136;
  border-bottom: 1px solid #1E2024;
  ${clearFix()};
  ${media.lessThan("medium")`
    width: 100%;
  `};
`;
const HeaderLeft = styled.div`
  float: left;
  margin-left: 8px;
  ${clearFix()};
`;

const HeaderSpan = styled.div`
  float: left;
  vertical-align: sub;
  margin-top: 14px;
  margin-left: 0px;
  cursor: pointer;
  display: none;
  ${media.lessThan("medium")`
    display: block;
    margin-right: 8px;
  `};
`;

const HeaderRight = styled.div`
  float: right;
  ${clearFix()};
  margin-right: 8px;
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

export default ({id, toggleLeftPanel, togglePanel}) => (
    <Query
    query={getAgentInfo}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: id
    }}
  >
    {({ loading, error, data, refetch }) => {
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
        );
      return (
  <Header>
    <HeaderLeft>
      <HeaderSpan onClick={toggleLeftPanel}>
        <Icons.Left width="22" height="22" color="#99ADC6" />
      </HeaderSpan>
      <Img src={`${data.viewer.agent.image}`} />
      <Title>{data.viewer.agent.name}</Title>
    </HeaderLeft>
    <HeaderRight>
      <Span>
        <Icons.Search width="20" height="20" color="#99ADC6" />
      </Span>
      <Span onClick={togglePanel}>
        <Icons.Sidebar width="22" color="#99ADC6" />
      </Span>
    </HeaderRight>
  </Header>
      )}}
      </Query>
);
