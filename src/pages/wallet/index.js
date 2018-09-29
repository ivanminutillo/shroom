import React from "react";
import { Icons } from "oce-components/build";
import Transfer from "../../components/transferAssets";
import styled from "styled-components";
import { clearFix } from "polished";
import getRelationship from "../../queries/getRelationships";
import { graphql } from "react-apollo";
import { compose } from "recompose";
import { LoadingMini, ErrorMini } from "../../components/loading";
import media from "styled-media-query";
import Select from 'react-select'

const options = [
  {
    value: '1', label: 'faircoin'
  },
  {
    value: '2', label: 'fakecoin'
  }
]
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  position: relative;
  flex: 0 0 auto;
  height: 50px;
  color: ${props => props.theme.color.p100};
  ${clearFix()};
  background: ${props => props.theme.color.p900};
`;

const Content = styled.div`
  background: #282c37;
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
`;

const HeaderRight = styled.div`
  float: right;
  ${clearFix()};
`;

const Span = styled.div`
  margin-top: 16px;
  margin-right: 16px;
  cursor: pointer;
`;

const Img = styled.div`
  float: left;
  background: url(${props => props.src});
  border-radius: ${props => props.theme.avatar.radius};
  width: ${props => props.theme.avatar.mini};
  height: ${props => props.theme.avatar.mini};
  margin-top: 11px;
  margin-left: 8px;
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
  ${media.lessThan("medium")`
  width: 100%;
  `};
`;

const FeedHeader = styled.div`
  height: 40px;
  border-radius: 3px;
  background: ${props => props.theme.color.p600};
`;
const HeaderTitle = styled.h3`
  color: ${props => props.theme.color.p300};
  line-height: 40px;
  margin-left: 16px;
`;

const FeedList = styled.div`
  margin-top: 8px;
  margin-bottom: 60px;
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
`;

const SelectWrapper = styled.div`
  width: 250px;
  margin-top: 5px;
  float: right;
  margin-right: 8px;
`;

const B = styled.b`
  text-decoration: underline;
  font-weight: 500;
  color: ${props => props.theme.color.p100};
`;

const DataBox = styled.div`
  font-weight: 300;
  float: left;
  background: #333746;
  height: 28px;
  padding: 0 20px;
  line-height: 28px;
  font-size: 14px;
  border-radius: 100px;
  border: 1px solid #18191e;
  margin-top: 9px;
  margin-left: 8px;
  margin-right: 8px;
  color: ${props => props.theme.color.p100};
  & b {
    letter-spacing: 1px;
    color: ${props => props.theme.color.g100};
  }
`;

const HeaderSpan = styled.div`
  float: left;
  vertical-align: sub;
  margin-top: 14px;
  margin-left: 8px;
  cursor: pointer;
  display: none;
  ${media.lessThan("medium")`
  display: block;
  `};
`;

// const options = [{ value: "1032", label: "fakecoin" }, {value: ""}];
const Wallet = props => {
  return props.loading ? (
    <LoadingMini />
  ) : props.error ? (
    <div style={{ padding: "20px" }}>
      <ErrorMini
        refetch={props.refetch}
        message={`Error! ${props.error.message}`}
      />
    </div>
  ) : (
    <Wrapper>
      <Header>
        <HeaderLeft>
          <HeaderSpan onClick={props.toggleLeftPanel}>
            <Icons.Left width="22" height="22" color="#99ADC6" />
          </HeaderSpan>
          <Title>Fakecoin Wallet</Title>
        </HeaderLeft>
        <HeaderRight>
          <DataBox>
            Your balance: <b>+129</b>
          </DataBox>
          <SelectWrapper>
              <Select options={options} />
            </SelectWrapper>
        </HeaderRight>
      </Header>
      <Content>
        <Inside>
          <Transfer id={props.id} agents={props.data.agentRelationships} />
          <Overview>
            <FeedHeader>
              <HeaderTitle>Recent Activities</HeaderTitle>
            </FeedHeader>
            <FeedList />
          </Overview>
        </Inside>
      </Content>
    </Wrapper>
  );
};

export default compose(
  graphql(getRelationship, {
    options: props => ({
      variables: {
        token: localStorage.getItem("oce_token"),
        id: 1032
      }
    }),
    props: ({ ownProps, data: { viewer, loading, error, refetch } }) => ({
      loading,
      error,
      refetch,
      data: viewer ? viewer.agent : null
    })
  })
)(Wallet);
