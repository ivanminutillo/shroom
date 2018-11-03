import React from "react";
import styled from "styled-components";
import { compose } from "react-apollo";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import Events from "../logEvent/events";
import Units from "../logEvent/unit";
import Select from "react-select";
import Button from "../../atoms/button";
import AsyncSelect from "react-select/lib/Async";
import getResourcesQuery from "../../queries/getResources";
import { Mutation } from "react-apollo";
import UPDATE_COMMITMENT from "../../mutations/updateCommitment";
import withNotif from "../notification";
import gql from "graphql-tag";

const customStyles = {
  control: base => ({
    ...base,
    color: "#333"
  }),
  input: base => ({
    ...base,
    color: "#333"
  }),
  singleValue: base => ({
    ...base,
    color: "#333"
  }),
  placeholder: base => ({
    ...base,
    color: "#333",
    fontSize: "14px"
  })
};

export default compose(
  withNotif('Requirement successfully updated', "error! Requirement had not been updated"),
  withFormik({
    mapPropsToValues: props => ({
      action: { value: props.intent.action, label: props.intent.action },
      numericValue: props.intent.committedQuantity.numericValue,
      unit: {
        value: props.intent.committedQuantity.unit.id,
        label: props.intent.committedQuantity.unit.name
      },
      affectedResourceClassifiedAsId: {
        value: props.intent.resourceClassifiedAs.id,
        label: props.intent.resourceClassifiedAs.name
      }
    }),
    validationSchema: Yup.object().shape({
      action: Yup.object().required(),
      note: Yup.string(),
      numericValue: Yup.number(),
      unit: Yup.object().required(),
      date: Yup.string(),
      affectedResourceClassifiedAsId: Yup.object().required(
        "Classification is a required field"
      )
    })  
})
)(({ intent, values, onError, onSuccess, setFieldValue, handleSentenceOpen, client }) => {
  const promiseOptions = (client, val) => {
    return client
      .query({
        query: getResourcesQuery,
        variables: { token: localStorage.getItem("oce_token") }
      })
      .then(res => {
        let options = res.data.viewer.allResourceClassifications.map(
          resource => ({
            value: resource.id,
            label: resource.name
          })
        );
        let newOpt = options.filter(i =>
          i.label.toLowerCase().includes(val.toLowerCase())
        );
        return newOpt;
      });
  };
  return (
    <Mutation
      mutation={UPDATE_COMMITMENT}
      onError={onError}
      update={(store, { data: { updateCommitment } }) => {
        const commitment = store.readFragment({
          id: `${updateCommitment.commitment.__typename}-${
            updateCommitment.commitment.id
          }`,
          fragment: gql`
            fragment myCommitment on Commitment {
              id
              action
              committedQuantity {
                numericValue
                unit {
                  id
                  name
                }
              }
              resourceClassifiedAs {
                name
                id
              }
            }
          `
        });
        commitment.action = updateCommitment.commitment.action;
        commitment.committedQuantity = updateCommitment.commitment.committedQuantity;
        commitment.resourceClassifiedAs = updateCommitment.commitment.resourceClassifiedAs;
        store.writeFragment({
          id: `${updateCommitment.commitment.__typename}-${
            updateCommitment.commitment.id
          }`,
          fragment: gql`
            fragment myCommitment on Commitment {
              id
              action
              committedQuantity {
                numericValue
                unit {
                  id
                  name
                }
              }
              resourceClassifiedAs {
                name
                id
              }
            }
          `,
          data: commitment
        });
        handleSentenceOpen()
        return onSuccess();
      }}
    >
      {(editSentence, { data }) => (
        <WrapperEdit>
          <EditSentence>
            <Field
              name={"action"}
              render={({ field }) => {
                return (
                  <Select
                    placeholder="Select an action..."
                    options={Events}
                    value={field.value}
                    onChange={val =>
                      setFieldValue("action", {
                        value: val.value,
                        label: val.label
                      })
                    }
                  />
                );
              }}
            />
            <Field
              name="numericValue"
              render={({ field }) => (
                <Input
                  name={field.name}
                  onChange={field.onChange}
                  type="number"
                  min="00.00"
                  max="100.00"
                  step="0.1"
                  placeholder="00.00"
                  value={field.value}
                />
              )}
            />
            <Field
              name={"unit"}
              render={({ field }) => {
                return (
                  <Select
                    placeholder="Select a unit..."
                    options={Units}
                    value={field.value}
                    onChange={val =>
                      setFieldValue("unit", {
                        value: val.value,
                        label: val.label
                      })
                    }
                  />
                );
              }}
            />
            <Field
              name="affectedResourceClassifiedAsId"
              render={({ field }) => (
                <AsyncSelect
                  placeholder="Select a classification..."
                  defaultOptions
                  cacheOptions
                  value={field.value}
                  styles={customStyles}
                  onChange={val =>
                    setFieldValue("affectedResourceClassifiedAsId", {
                      value: val.value,
                      label: val.label
                    })
                  }
                  loadOptions={val => promiseOptions(client, val)}
                />
              )}
            />
          </EditSentence>
          <EditButtons>
            <Button gray onClick={handleSentenceOpen}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                editSentence({
                  variables: {
                    token: localStorage.getItem("oce_token"),
                    id: intent.id,
                    action: values.action.value.toLowerCase(),
                    committedResourceClassifiedAsId: values.affectedResourceClassifiedAsId.value,
                    committedUnitId: values.unit.value,
                    committedNumericValue: values.numericValue,
                  }
                })
              }
            >
              Publish
            </Button>
          </EditButtons>
        </WrapperEdit>
      )}
    </Mutation>
  );
});

const EditSentence = styled.div`
  z-index: 999999999999;
  position: relative;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 3fr;
  grid-column-gap: 4px;
`;

const EditButtons = styled.div`
  margin-top: 8px;
  & button {
    margin-right: 8px;
  }
`;

const Input = styled.input`
  border: 1px solid #dadada;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: none;
  text-align: center;
`;

const WrapperEdit = styled.div`
margin-bottom: 8px;
`;
