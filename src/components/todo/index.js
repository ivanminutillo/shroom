import React from 'react'
import styled from 'styled-components'
import HeaderTitle from "../agentSectionHeader";
import Intent from "../agentintents/intents";
export default props => {
  return (
    <EventsInfo>
      <WrapperIntents>
        <HeaderTitle
          isOpen={props.isCommittedOpen}
          action={props.handleCommittedOpen}
          title={`Inbox (${props.activeIntents.length})`}
        />
        {props.isCommittedOpen ? (
          <ContentIntents>
            {props.activeIntents.map((intent, i) => (
              <Intent
                handleAddEvent={props.handleAddEvent}
                addEvent={props.addEvent}
                toggleModal={props.toggleModal}
                key={i}
                toggleValidationModal={props.toggleValidationModal}
                data={intent}
                client={props.client}
                scopeId={intent.scope ? intent.scope.id : null}
                myId={props.providerId}
                providerImage={props.providerImage}
              />
            ))}
          </ContentIntents>
        ) : null}
      </WrapperIntents>
      <WrapperIntents>
        <HeaderTitle
          isOpen={props.isCompletedOpen}
          action={props.handleCompletedOpen}
          title={`Completed (${props.completed.length})`}
        />
        {props.isCompletedOpen ? (
          <ContentIntents>
            {props.completed.map((intent, i) => (
              <Intent
                handleAddEvent={props.handleAddEvent}
                addEvent={props.addEvent}
                toggleModal={props.toggleModal}
                key={i}
                data={intent}
                client={props.client}
                scopeId={intent.scope.id}
                myId={props.providerId}
                providerImage={props.providerImage}
              />
            ))}
          </ContentIntents>
        ) : null}
      </WrapperIntents>
    </EventsInfo>
  )}



const WrapperIntents = styled.div`
position: relative;
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