import React from 'react'
import styled from 'styled-components'
import HeaderTitle from "../agentSectionHeader";
import Process from '../process';

export default props => {
    console.log(props.activeProcesses)
  return (
      <WrapperIntents>
        <HeaderTitle
          isopen={props.isCommittedOpen}
          action={props.handleCommittedOpen}
          title={`Inbox (${props.activeProcesses.length})`}
        />
          <ContentIntents>
            {props.activeProcesses.map((process, i) => (
              <Process
                key={i}
                data={process}
                client={props.client}
                scopeId={process.scope ? process.scope.id : null}
                myId={props.providerId}
                providerImage={props.providerImage}
              />
            ))}
          </ContentIntents>
      </WrapperIntents>
  )}



const WrapperIntents = styled.div`
position: relative;
margin: 0 20px;
`;

const ContentIntents = styled.div`
overflow-y: scroll;
margin: 0;
padding: 0;
width: 100%;
`;


const EventsInfo = styled.div`
  display: grid;
  column-gap: 16px;
  // grid-template-columns: 1fr 2fr
  padding: 16px;
  padding-top: 0;
`;