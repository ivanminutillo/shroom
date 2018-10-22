import React from "react";
import styled, {css} from "styled-components";
import Header from "../agentSectionHeader";
import Intent from "./intents";
import { Query } from "react-apollo";
import {Icons} from 'oce-components'
import { LoadingMini, ErrorMini } from "../../components/loading";
import getComm from "../../queries/getCommitments";
import getSkills from "../../queries/getSkillsCommitments";
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

const SpanText = styled.div`
  display: inline-block;
  vertical-align: super;
`
const Span = styled.div`
  cursor: pointer;
  height: 36px;
  width: ${props => props.withText ? 'auto' : '30px'};
  vertical-align: sub;
  text-align: center;
  padding-top: 8px;
  float: left;
  margin-left: 8px;
  background: ${props => props.active ? '#282b30' : 'transparent'}
  ${props =>
    props.withText &&
    css`
    line-height: 36px;
    font-size: 13px;
    color: aliceblue;
    background: #485562;
    padding: 0 8px;
    & svg {
      margin-top: 8px;
      margin-right: 8px;
    }
    `};
 
`;
const Intents = props => (
  <Wrapper>
    <Header title={`Requirements (${props.intentQuery})`} actions={<span><Span withText onClick={props.handleQuery}><Icons.Eye width='18' height='18' color={props.query === 'Commitments' ? 'rgb(153, 173, 198)' : '#3B99FC'} /><SpanText>match my skills</SpanText></Span><Span active={props.intentsOptions} onClick={props.onIntentsOptions} ><Icons.Settings width='18' height='18' color='rgb(153, 173, 198)' /></Span></span>} />
    {props.intentsOptions ? <IntentsOptions profile={props.profile} value={props.intentQuery} onIntentQuery={props.onIntentQuery} /> : null}
    <Content>
      <Query
        query={props.query === 'Commitments' ? getComm : getSkills}
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
            if (data.viewer.agent.commitmentsMatchingSkills) {
              intents = data.viewer.agent.commitmentsMatchingSkills
            } else {
              intents = data.viewer.agent.agentCommitments
            }
            if (!props.profile) {
              if (props.intentQuery === 'All') {
                intents
              } else if (props.intentQuery === 'Available') {
                intents = intents.filter(int => int.provider === null)
              } else if (props.intentQuery === 'Taken') {
                intents = intents.filter(int => int.provider)
              } else if (props.intentQuery === 'Completed') {
                intents = intents.filter(int => int.isFinished)
              }
            } else {
              if (props.intentQuery === 'All') {
                intents = intents
              } else if (props.intentQuery === 'Completed') {
                intents = intents.filter(int => int.isFinished)
              }
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
  withState('query', 'onQuery', 'Commitments'),
  withState('intentsOptions', 'handleIntentsOptions', false),
  withHandlers({
    handleQuery: props => () => {
      if (props.query === 'Commitments' ) {
       return props.onQuery('Skills')
      } else {
        return props.onQuery('Commitments')
      }
    },
    onIntentsOptions: props => () => {
      props.handleIntentsOptions(!props.intentsOptions)
    }
  })
)(Intents);