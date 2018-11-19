import React from "react";
import styled, { css } from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Intent from "../../components/agentintents/intents";
import Timeline from './timeline'
import "react-tabs/style/react-tabs.css";

export default props => (
  <Tabs>
    <StyledTabList>
      <StyledTab>Requirements</StyledTab>
      <StyledTab>Overview</StyledTab>
    </StyledTabList>

    <StyledTabPanel>
      {props.inputs.map((intent, i) => (
        <Intent
          handleAddEvent={props.handleAddEvent}
          addEvent={props.addEvent}
          toggleModal={props.toggleModal}
          key={i}
          toggleValidationModal={props.toggleValidationModal}
          data={intent}
          client={props.client}
          scopeId={props.scope ? props.scope.id : null}
          myId={props.providerId}
          providerImage={props.providerImage}
        />
      ))}
    </StyledTabPanel>
    <StyledTabPanel>
      <Timeline inputs={props.inputs}/>
    </StyledTabPanel>
  </Tabs>
);

const StyledTabList = styled(TabList)`
  border-bottom: 4px solid #d0e1fb40;
  margin: 0 0 10px;
  padding: 0;
  border-radius: 2px;
`;

const StyledTabPanel = styled(TabPanel)`
  margin-top: 32px;
`;

const StyledTab = styled(Tab)`
  display: inline-block;
  border-bottom: none;
  bottom: -1px;
  position: relative;
  list-style: none;
  padding: 6px 12px;
  cursor: pointer;
  background: transparent !important;
  color: ${props =>
    props.selected ? "#333 !important" : "#33333360 !important"};
  font-size: 13px;
  font-weight: 500 !important;
  letter-spacing: 1px;
  margin-right: 24px;
  padding: 0;
  border: 0;
  padding-bottom: 12px;
  ${props =>
    props.selected &&
    css`
      &:before {
        position: absolute;
        content: "";
        bottom: -3px;
        width: 100%;
        height: 4px;
        background-color: #53d2b2;
        display: block;
        border-radius: 20px;
      }
    `};
`;
