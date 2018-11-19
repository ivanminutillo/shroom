import React from 'react'
import styled from 'styled-components'
import HeaderTitle from "../agentSectionHeader";
import Process from '../process';

export default props => {
  return (
      <WrapperIntents>
        <div style={{marginLeft: '8px'}}>
        <HeaderTitle
          isopen={props.isCommittedOpen}
          action={props.handleCommittedOpen}
          title={`Inbox (${props.activeProcesses.length})`}
        />
        </div>
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
`;

const ContentIntents = styled.div`
margin: 0;
padding: 0;
width: 100%;
`;
