import React from "react";
import styled from "styled-components";
import Intent from "../agentintents/intents";
import {compose, withState, withHandlers } from "recompose";
import OutsideClickHandler from "react-outside-click-handler";

const Header = styled.div`
  height: 40px;
  border-radius: 2px;
  background: #fff;
  border: 1px solid #E4E4E4;
  margin: 0 8px;
  position: relative;
  margin-top: 10px;
`
const WrapperFilter = styled.div`
float: right;
height: 34px;
margin-top: 2px;
margin-right: 2px;
background: #F0F0F0;
border-radius: 2px;
font-size: 13px;
padding: 0 10px;
line-height: 34px;
font-weight: 500;
cursor: pointer;
letter-spacing: .5px;
`

const FilterList = styled.div`
position: absolute;
right: 0;
width: 200px;
top: 40px;
background: white;
border-radius: 2px;
z-index: 99999;
border: 1px solid #dadada;
`
const Title = styled.h3`
line-height: 40px;
display: inline-block;
margin-left: 8px;
color: ${props => props.theme.color.p900}

`

const Item = styled.div`
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  padding: 0 10px;
  cursor: pointer;
  &:hover {
    background: #cecece;
  }
`
export default compose(
  withState('isOpen', 'onOpen', false),
  withHandlers({
    handleOpen: props => () => props.onOpen(!props.isOpen)
  })
)(props => {
  return (
    <EventsInfo>
      <WrapperIntents>
        <Header>
          <Title>Feed</Title>
          <WrapperFilter onClick={props.handleOpen}>{props.filter ? props.filter : 'All'}</WrapperFilter>
          {props.isOpen ? 
          <OutsideClickHandler onOutsideClick={props.handleOpen}>
          <FilterList>
            <Item onClick={() => props.onFilter('all')}>All</Item>
            <Item onClick={() => props.onFilter('active')}>Active</Item>
            <Item onClick={() => props.onFilter('completed')}>Completed</Item>
            <Item onClick={() => props.onFilter('committed')}>Committed</Item>
            <Item onClick={() => props.onFilter('with process')}>With process</Item>
            <Item onClick={() => props.onFilter('without process')}>Without process</Item>
          </FilterList>
            </OutsideClickHandler>
           : null}
        </Header>
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
      {/* <WrapperIntents>
        <div style={{ marginLeft: "8px" }}>
          <HeaderTitle
            isopen={props.isCompletedOpen}
            action={props.handleCompletedOpen}
            title={`Completed (${props.completed.length})`}
          />
        </div>
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
      </WrapperIntents> */}
    </EventsInfo>
  );
});

const WrapperIntents = styled.div`
  position: relative;
`;

const ContentIntents = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
`;

const EventsInfo = styled.div`
  will-change: transform;
  display: flex;
  flex: 1;
  min-height: 100%;
  flex-direction: column;
`;
