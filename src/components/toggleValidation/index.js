import React from "react";
import styled from "styled-components";
import { Icons } from "oce-components";
import Button from "../../atoms/button";
import withNotif from "../notification";
import { compose } from "recompose";
import CREATE_VALIDATION from "../../mutations/createValidation";
import DELETE_VALIDATION from "../../mutations/deleteValidation";
import gql from "graphql-tag";

import { Mutation } from "react-apollo";
import GetEvent from "../../queries/getEvent";

const ValidationFragment = gql`
  fragment myEvent on EconomicEvent {
    validations {
      id
      note
      validatedBy {
        name
        id
      }
    }
  }
`;

export default compose(
  withNotif("Validation correctly updated", "Validation is not updated")
)(({ eventId, providerId, note, onError, onSuccess }) => {
  return (
    <Mutation
      mutation={CREATE_VALIDATION}
      onError={onError}
      update={(store, { data: { createValidation } }) => {
        const event = store.readFragment({
          id: `EconomicEvent-${eventId}`,
          fragment: ValidationFragment
        });

        event.validations.push({
          id: createValidation.validation.id,
          note: createValidation.validation.note,
          validatedBy: {
            id: createValidation.validation.validatedBy.id,
            name: createValidation.validation.validatedBy.name,
            __typename: "Person"
          },
          __typename: "Validation"
        });

        store.writeFragment({
          id: `EconomicEvent-${eventId}`,
          fragment: ValidationFragment,
          data: event
        });
        return onSuccess();
      }}
    >
      {(createValidation, { data }) => (
        <Button
          style={{ float: "right", borderRadius: 0 }}
          onClick={() =>
            createValidation({
              variables: {
                token: localStorage.getItem("oce_token"),
                validatedById: providerId,
                economicEventId: eventId,
                note: note
              }
            })
          }
        >
          Validate
        </Button>
      )}
    </Mutation>
  );
});

export const DeleteValidation = compose(
  withNotif("Validation correctly updated", "Validation is not updated")
)(({ eventId, validationId, onError, onSuccess }) => (
  <Mutation
    mutation={DELETE_VALIDATION}
    onError={onError}
    update={(store, { data: { createValidation } }) => {
      const event = store.readFragment({
        id: `EconomicEvent-${eventId}`,
        fragment: ValidationFragment
      });

      let ValIndex = event.validations.findIndex(
        item => Number(item.id) === Number(validationId)
      );
      event.validations.splice(ValIndex, 1);
      store.writeFragment({
        id: `EconomicEvent-${eventId}`,
        fragment: ValidationFragment,
        data: event
      });
      return onSuccess();
    }}
  >
    {(deleteValidation, { data }) => (
      <Button
        primary
        onClick={() =>
          deleteValidation({
            variables: {
              token: localStorage.getItem("oce_token"),
              id: validationId
            }
          })
        }
      >
        <Span>
          <Icons.Trash width="18" height="18" color="#f0f0f0" />
        </Span>
        Delete validation
      </Button>
    )}
  </Mutation>
));


const Span = styled.span`
vertical-align: sub;
margin-right: 8px;
`
