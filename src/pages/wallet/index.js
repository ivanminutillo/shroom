import React from "react";
import Icons from "../../atoms/icons.tsx";
import Feed from '../../components/FeedItem/index.tsx'
import Transfer from "../../components/transferAssets";
import styled from "styled-components";
import { clearFix } from "polished";
import getRelationship from "../../queries/getRelationships";
import { graphql } from "react-apollo";
import { compose, withHandlers,lifecycle, withState } from "recompose";
import { LoadingMini, ErrorMini } from "../../components/loading/index.tsx";
import media from "styled-media-query";
import getList, { getTxs, balance } from "../../xhr/socialwallet";
import getTxss from "../../queries/getTxs";
import moment from "moment";
import { Query } from "react-apollo";

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
  background: ${props => props.theme.color.p600};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  ${media.lessThan("medium")`
  width: 100%;
  `};
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
const SelectWrapper = styled.div`
  width: 250px;
  margin-top: 5px;
  float: right;
  margin-right: 8px;
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
  border: ${props => props.status ? '1px solid #18191e' : '1px solid red'};
  margin-top: 9px;
  margin-left: 8px;
  margin-right: 8px;
  color: ${props => props.theme.color.p100};
  & b {
    letter-spacing: 1px;
    color: ${props => props.status ? props.theme.color.g100 : 'red'};
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

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p100};
`;

const B = styled.b`
  text-decoration: underline;
  font-weight: 500;
  color: ${props => props.theme.color.p100};
`;

const Tag = styled.span`
  border: 1px solid rgb(65, 155, 249);
  color: rgb(65, 155, 249);
  border-radius: 3px;
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  display: inline-block;
  margin-right: 8px;
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 500;
`;

// const options = [{ value: "1032", label: "fakecoin" }, {value: ""}];
const Wallet = props => (
  <Query
    query={getRelationship}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: 1032
    }}
    onCompleted={data => props.getTxs(data)}
  >
    {({ loading, error, data, refetch, networkStatus }) => {
      if (networkStatus === 4) return "Refetching!";
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini
            refetch={props.refetch}
            message={`Error! ${props.error.message}`}
          />
        );
      return (
        <Wrapper>
          <Header>
            <HeaderLeft>
              <HeaderSpan onClick={props.toggleLeftPanel}>
                <Icons.Left width="22" height="22" color="#99ADC6" />
              </HeaderSpan>
              <Title>Fakecoin Wallet</Title>
            </HeaderLeft>
            <HeaderRight>
              <DataBox status={props.balance < 0 ? false : true}>
                Your balance: <b>{props.balance}</b>
              </DataBox>
            </HeaderRight>
          </Header>
          <Content>
            <Inside>
              <Transfer
                isWallet={true}
                id={props.id}
                agents={data.viewer.agent.agentRelationships}
                txs={props.txs}
                addTx={props.addTx}
                onTxs={props.onTxs}
                addToTxChain={props.addToTxChain}
              />
              <Overview>
                <FeedHeader>
                  <HeaderTitle>Recent Activities</HeaderTitle>
                </FeedHeader>
                {props.txs !== null
                  ? props.txs.map((ev, i) => (
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
                              " to " +
                              ev.receiver.name}
                          </FeedItem>
                        }
                        secondary={ev.note.map((tag, i) => (
                          <Tag key={i}>{tag}</Tag>
                        ))}
                        date={moment(ev.start).format("DD MMM")}
                      />
                    ))
                  : null}
                <FeedList />
              </Overview>
            </Inside>
          </Content>
        </Wrapper>
      );
    }}
  </Query>
);
export default compose(
  withState("balance", "onBalance", null),
  withState("txs", "onTxs", null),
  lifecycle({
    componentDidMount() {
        getList(
          {
            blockchain: "mongo",
            "account-id": String(this.props.id)
          },
          balance
        )
          .then(res => res.json())
          .then(res => this.props.onBalance(res.amount))
          .catch(err => console.log(err));
      }
  }),
  withHandlers({
    addToTxChain: props => tx => {
      props.onTxs([tx, ...props.txs])
    },
    addTx: props => (data, tx) => {
      let provider = data.find(
        o2 => Number(tx["from-id"]) === Number(o2.subject.id)
      );
      let receiver = data.find(
        o2 => Number(tx["to-id"]) === Number(o2.subject.id)
      );
      return {
        note: tx.tags,
        action: "transfer",
        provider: provider ? provider.subject : null,
        receiver: receiver ? receiver.subject : null,
        start: tx.timestamp,
        affects: {
          resourceClassifiedAs: {
            name: "FakeCoin"
          }
        },
        affectedQuantity: {
          numericValue: tx.amount,
          unit: {
            name: "FakeCoin"
          }
        }
      };
    }}),
    withHandlers({
    getTxs: props => data => {
      getList(
        {
          blockchain: "mongo"
        },
        getTxs
      )
        .then(res => res.json())
        .then(res => {
          let txs = res.transactions.map(o => props.addTx(data.viewer.agent.agentRelationships, o));
          let newTxs = txs.filter(tx => tx.provider && tx.receiver);
          return props.onTxs(newTxs);
        })
        .catch(err => console.log(err));
    }
  }),
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
      agents: viewer ? viewer.agent : null
    })
  })
)(Wallet);
