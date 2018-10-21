import React from "react";
import styled from "styled-components";
import Plan from "./plan";
import Header from "../agentSectionHeader";
import { LoadingMini, ErrorMini } from "../../components/loading";
import {compose, withHandlers, withState} from 'recompose'
import { Query } from "react-apollo";
import {Icons} from 'oce-components'
import PlanOptions from './planOptions'
import getActivePlan from "../../queries/getPlans";
import getAllPlans from "../../queries/getAllPlans";
import getFinishedPlans from "../../queries/getFinishedPlans";

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

const AgentPlans = props => {
  let query
  if (props.planQuery === 'All') {
    query = getAllPlans
  } else if (props.planQuery === 'Closed') {
    query = getFinishedPlans
  } else {
    query = getActivePlan
  }
  return (
  <Wrapper>
    <Header  title={"Plans (" + props.planQuery + ")"} actions={<Span active={props.planOptions} onClick={props.onPlanOptions} ><Icons.Settings width='18' height='18' color='rgb(153, 173, 198)' /></Span>} />
    {props.planOptions ? <PlanOptions onPlanQuery={props.onPlanQuery} /> : null}
    <Content>
      <Query
        query={query}
        variables={{
          token: localStorage.getItem("oce_token"),
          id: props.id 
        }}
      >
        {({ loading, error, data, refetch }) => {
          if (loading) return <LoadingMini />;
          if (error)
            return (
              <ErrorMini
                refetch={refetch}
                message={`Error! ${error.message}`}
              />
            );
          return (
            <div style={{padding: '8px'}}>
            {
              data.viewer.agent.agentPlans.map((plan, i) => (
                <Plan key={i} plan={plan} />
              ))
            }
            </div>
          )
        }}
      </Query>
    </Content>
  </Wrapper>
)};


export default compose(
  withState('planQuery', 'onPlanQuery', 'Active'),
  withState('planOptions', 'handlePlanOptions', false),
  withHandlers({
    onPlanOptions: props => () => {
      props.handlePlanOptions(!props.planOptions)
    }
  })
)(AgentPlans);