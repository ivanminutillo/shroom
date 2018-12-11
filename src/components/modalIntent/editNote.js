import React from "react";
import styled from "styled-components";
import Button from "../../atoms/button";
import Textarea from "../../atoms/textarea.tsx";
import { Mutation } from "react-apollo";
import UPDATE_COMMITMENT from "../../mutations/updateCommitment";
import withNotif from "../notification";
import { compose } from "react-apollo";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import gql from "graphql-tag";

export default compose(
  withNotif(
    "Note successfully updated",
    "Error, the note has not been updated"
  ),
  withFormik({
    mapPropsToValues: props => ({
      note: props.intent.note
    }),
    validationSchema: Yup.object().shape({
      note: Yup.string()
    })
  })
)(({ handleNoteOpen, intent, values,  onError, onSuccess }) => (
  <Mutation
    mutation={UPDATE_COMMITMENT}
    onError={onError}
    update={(store, { data: { updateCommitment } }) => {
      store.writeFragment({
        id: `${updateCommitment.commitment.__typename}-${
          updateCommitment.commitment.id
        }`,
        fragment: gql`
          fragment myCommitment on Commitment {
            id
            note
          }
        `,
        data: {
          __typename: 'Commitment',
          note: updateCommitment.commitment.note
        }
      });
      handleNoteOpen();
      return onSuccess();
    }}
  >
    {(editSentence, { data }) => (
      <Wrapper>
        <WrapperTextarea>
          <Field
            name={"note"}
            render={({ field }) => {
              return  <Textarea
              value={field.value}
              name={field.name}
              onChange={field.onChange}
              placeholder={"Type a note..."}
            />
            }}
          />
        </WrapperTextarea>
        <EditButtons>
          <Button gray onClick={handleNoteOpen}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              editSentence({
                variables: {
                  token: localStorage.getItem("oce_token"),
                  id: intent.id,
                  note: values.note
                }
              })
            }
          >
            Publish
          </Button>
        </EditButtons>
      </Wrapper>
    )}
  </Mutation>
));

const Wrapper = styled.div``;

const WrapperTextarea = styled.div`
  height: 80px;
`;

const EditButtons = styled.div`
  margin-top: 8px;
  & button {
    margin-right: 8px;
  }
`;
