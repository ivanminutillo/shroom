import React from "react";
import LogStatus from "./smartSentence";
import { withState, withHandlers, compose } from "recompose";
import styled from "styled-components";

import { Icons } from "oce-components/build";
import moment from 'moment'
import createEvent from "../../mutations/createEvent";
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import { graphql } from "react-apollo";
import Confirm from "../../components/modalExample";
import HelpModal from "../../components/helpModal";
import events from './events'
import getProcesses from '../../queries/getProcesses'
import getResourcesQuery from "../../queries/getResources";
const Wrapper = styled.div`
  position: relative;
`;

const Smart = ({
  providerImage,
  providerName,
  value,
  onChange,
  onProcesses,
  modalIsOpen,
  toggleModal,
  onEvents,
  onAddTaxonomy, 
  onAddEvent, 
  onAddProcess,
  onTaxonomies, 
  taxonomy,
  taxonomyId,
  process,
  event,
  logEvent,
  amount,
  toggleHelpModal,
  helpModalIsOpen
}) => {
  return (
    <Wrapper>
      <Confirm 
        modalIsOpen={modalIsOpen}
        toggleModal={toggleModal}
        providerImage={providerImage}
        providerName={providerName}
        logEvent={logEvent}
        economicEvent={{
          message: value,
          taxonomy: taxonomy,
          taxonomyId: taxonomyId,
          process: process,
          event: event,
          amount: amount
        }}
      />
      <HelpModal 
        modalIsOpen={helpModalIsOpen}
        toggleModal={toggleHelpModal}
      />
      <LogStatus
        onTaxonomies={onTaxonomies}
        onProcesses={onProcesses}
        onEvents={onEvents}
        value={value}
        toggleHelpModal={toggleHelpModal}
        handleChange={onChange}
        onAddTaxonomy={onAddTaxonomy}
        onAddProcess={onAddProcess}
        onAddEvent={onAddEvent}
        toggleModal={toggleModal}
        economicEvent={{
          message: value,
          taxonomy: taxonomy,
          taxonomyId: taxonomyId,
          process: process,
          event: event,
          amount: amount
        }}
      />
    </Wrapper>
  );
};

export default compose(
  graphql(createEvent, { name: "createEventMutation" }),
  graphql(deleteNotification, { name: "deleteNotification" }),
  graphql(updateNotification, { name: "updateNotification" }),

  withState("menuSelected", "onMenuSelection", "1"),
  withState("value", "setValue", ""),
  withState('taxonomyId', 'onTaxonomy', null),
  withState('processId', 'onProcess', null),
  withState('taxonomy', 'onTaxonomyDisplay', null),
  withState('process', 'onProcessDisplay', null),
  withState('event', 'onEvent', null),
  withState('amount', 'onAmount', null),
  withState('modalIsOpen', 'toggleModalIsOpen', false),
  withState('helpModalIsOpen', 'toggleHelpModalIsOpen', false),
  withHandlers({
    toggleModal: props => () => (
      props.toggleModalIsOpen(!props.modalIsOpen)
    ),
    toggleHelpModal: props => () => (
      props.toggleHelpModalIsOpen(!props.helpModalIsOpen)
    ),
    onAmount: props => (val) => {
      if (props.amount) {
        return null
      }
      return val
    },
    onEvents: props => () => {
      if (props.event) {
        return null
      }
      return events
    },
    onProcesses: props => (search, cb) => {
      if (props.processId) {
        return null
      }
      props.client
      .query({
        query: getProcesses,
        variables: {token: localStorage.getItem("oce_token"), id: props.scopeId}
      })
      .then(res => {
        let options = res.data.viewer.agent.agentProcesses.map(pr => ({
          id: pr.id,
          display: pr.name.toLowerCase()
        }));
        return options.filter(pr => pr.display.includes(search.toLowerCase()))
      })
      .then(cb)
    },
    onTaxonomies: props => (search, cb) => {
      if (props.taxonomyId) {
        return null
      }
      props.client
        .query({
          query: getResourcesQuery,
          variables: { token: localStorage.getItem("oce_token") }
        })
        .then(res => {
          let options = res.data.viewer.allResourceClassifications.map(resource => ({
            id: resource.id,
            display: resource.name.toLowerCase()
          }));
          return options.filter(tax => tax.display.includes(search.toLowerCase()))
        })
        .then(cb)
    },
    logEvent: props => (note, unit) => {
      let date = moment().format("YYYY-MM-DD");
      let eventMutationVariables = {
        token: localStorage.getItem("oce_token"),
        id: props.providerId,
        providerId: props.providerId,
        receiverId: props.scopeId,
        action: props.event,
        scopeId: props.scopeId,
        note: note,
        affectedNumericValue: props.amount,
        affectedUnitId: unit,
        start: date,
        affectedResourceClassifiedAsId: props.taxonomyId
      };
      return props
        .createEventMutation({
          variables: eventMutationVariables
        })
        .then(data =>
          props
            .updateNotification({
              variables: {
                message: (
                  <div style={{ fontSize: "14px" }}>
                    <span style={{ marginRight: "10px", verticalAlign: "sub" }}>
                      <Icons.Bell width="18" height="18" color="white" />
                    </span>
                    Event logged successfully!
                  </div>
                ),
                type: "success"
              },
            })
            .then(res => {
              setTimeout(() => {
                props.deleteNotification({
                  variables: { id: res.data.addNotification.id }
                });
              }, 1000);
            })
        )
        .catch(e => {
          const errors = e.graphQLErrors.map(error => error.message);
          props
          .updateNotification({
            variables: {
              message: (
                <div style={{ fontSize: "14px" }}>
                  <span style={{ marginRight: "10px", verticalAlign: "sub" }}>
                    <Icons.Cross width="18" height="18" color="white" />
                  </span>
                  {errors}
                </div>
              ),
              type: "alert"
            }
          })
          .then(res => {
            setTimeout(() => {
              props.deleteNotification({
                variables: { id: res.data.addNotification.id }
              });
            }, 1000);
          });
        });
    },
    onChange: (props) => (ev, newValue) => {
      props.setValue(newValue);
      let prevMentions = props.value.split('@[');
      let currentMentions = newValue.split('@[');
      let check = newValue.split(']@ ')[1]
      let test= newValue.split('@[ ')
      var regex = /\d+/g;
      let amount = test.filter(c => /\d+$/.test(c))
      if (check && check.match("[0-9]")) {
        if (check.startsWith('@[') === false) {
            let e = check.match(regex)
            props.onAmount(e[0])
        }
      }
      if (currentMentions.length < prevMentions.length) {
        let difference = prevMentions.filter(x => !currentMentions.includes(x));
        difference.map(item => {
          if (item.includes('taxonomy')) {
            props.onTaxonomy(null)
            props.onTaxonomyDisplay(null)
            return null
          } else if (item.includes('process')) {
            props.onProcess(null)
            props.onProcessDisplay(null)
            return null
          } else if (item.includes('event')) {
            return props.onEvent(null)
          } return null
        })
      }
    },
    onAddTaxonomy: (props) => (id, display) => {
      props.onTaxonomy(id)
      props.onTaxonomyDisplay(display)
    },
    onAddProcess: (props) => (id, display) => {
      props.onProcess(id)
      props.onProcessDisplay(display)
    },
    onAddEvent: (props) => (id) => {
      props.onEvent(id)
    },
    handleMenuSelection: props => val => {
      props.onMenuSelection(val);
      return null;
    }
  })
)(Smart);
