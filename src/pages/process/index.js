import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import Header from "./header";
import Output from "./outputs";
import Actions from "./actions";
import getProcess from "../../queries/getProcess";
import { LoadingMini, ErrorMini } from "../../components/loading/index.tsx";
import { Query } from "react-apollo";
import moment from "moment";
const Process = props => (
  <Query
    query={getProcess}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: Number(props.id)
    }}
  >
    {({ loading, error, data, refetch, client }) => {
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
        );
      let percentage =
        (data.viewer.process.committedInputs.filter(i => i.isFinished).length *
          100) /
        data.viewer.process.committedInputs.length;
      return (
        <Body>
          <Wrapper isopen={props.isopen}>
            <Header
              title={data.viewer.process.name}
              note={data.viewer.process.note}
              from={moment(data.viewer.process.plannedStart).format("DD MMM")}
              to={moment(data.viewer.process.plannedFinish).format("DD MMM")}
              scope={data.viewer.process.scope}
              plan={data.viewer.process.processPlan}
              agents={data.viewer.process.workingAgents}
            />
            
            <Output
              providerId={props.providerId}
              outputs={data.viewer.process.committedOutputs}
              percentage={percentage}
              scopeId={data.viewer.process.scope.id}
              processId={data.viewer.process.id}
            />
            <Content>
              <Actions
                providerImage={props.providerImage}
                providerId={props.providerId}
                scope={data.viewer.process.scope}
                inputs={data.viewer.process.committedInputs}
                client={client}
                events={data.viewer.process.unplannedEconomicEvents}
                processId={data.viewer.process.id}
              />
            </Content>
          </Wrapper>
        </Body>
      );
    }}
  </Query>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  background: #fff;
  padding: 8px;
  margin-left: 8px;
  ${media.lessThan("medium")`
    display: ${props => (props.isopen ? "none" : "flex")}
  `};
`;
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;
const Content = styled.div`
  display: grid;
  margin-top: 26px;
  grid-template-columns: 1fr
  grid-column-gap: 24px;
`;

export default Process;
