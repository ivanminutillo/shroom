import React from "react";
import styled from "styled-components";
import Header from "../agentSectionHeader";
import Intent from "./intents";
import { Query } from "react-apollo";
import {Icons} from 'oce-components'
import { LoadingMini, ErrorMini } from "../../components/loading";
import getComm from "../../queries/getCommitments";
import IntentsOptions from './intentsOptions'
import {compose, withHandlers, withState} from 'recompose'

const Wrapper = styled.div`
background: #333D47;
box-shadow: 0 2px 4px 2px rgba(0,0,0,.1);
border-radius: 4px;
position: relative;
`;


const Content = styled.div`
height: 250px;
overflow-y: scroll;
margin: 0;
padding: 0;
width: 100%;
`;


const Span = styled.div`
  cursor: pointer;
  height: 36px;
  width: 30px;
  vertical-align: sub;
  text-align: center;
  padding-top: 6px;
  background: ${props => props.active ? '#282b30' : 'transparent'}
`;
const Intents = props => (
  <Wrapper>
    <Header title={`Requirements (${props.intentQuery})`} actions={<Span active={props.intentsOptions} onClick={props.onIntentsOptions} ><Icons.Settings width='18' height='18' color='rgb(153, 173, 198)' /></Span>} />
    {props.intentsOptions ? <IntentsOptions value={props.intentQuery} onIntentQuery={props.onIntentQuery} /> : null}
    <Content>
      <Query
        query={getComm}
        variables={{
          token: localStorage.getItem("oce_token"),
          id: props.id
        }}
      >
        {({ loading, error, data, refetch, fetchMore }) => {
          if (loading) return <LoadingMini />;
          if (error)
            return (
              <ErrorMini
                refetch={refetch}
                message={`Error! ${error.message}`}
              />
            );
          let intents
          if (props.intentQuery === 'All') {
            intents = data.viewer.agent.agentCommitments
          } else if (props.intentQuery === 'Available') {
            intents = data.viewer.agent.agentCommitments.filter(int => int.provider === null)
          } else if (props.intentQuery === 'Taken') {
            intents = data.viewer.agent.agentCommitments.filter(int => int.provider)
          } else if (props.intentQuery === 'Completed') {
            intents = data.viewer.agent.agentCommitments.filter(int => int.isFinished)
          }
          return intents.map((intent, i) => (
            <Intent toggleModal={props.toggleModal} key={i} data={intent} />
          ));
        }}
      </Query>
    </Content>
  </Wrapper>
);

export default compose(
  withState('intentQuery', 'onIntentQuery', 'All'),
  withState('intentsOptions', 'handleIntentsOptions', false),
  withHandlers({
    onIntentsOptions: props => () => {
      props.handleIntentsOptions(!props.intentsOptions)
    }
  })
)(Intents);