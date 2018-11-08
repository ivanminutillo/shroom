import React from "react";
import { compose, withHandlers } from "recompose";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import AsyncSelect from "react-select/lib/Async";
import getResourcesQuery from "../../queries/getResources";
import addSkill from "../../mutations/addSkill";
import removeSkill from "../../mutations/removeSkill";
import { graphql } from "react-apollo";
import withNotif from "../../components/notification";
import gql from "graphql-tag";
import {getAllResources} from '../../helpers/asyncQueries';

const GET_SKILLS = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        agentSkillRelationships {
          id
          resourceClassification {
            name
            id
          }
        }
        agentSkills {
          id
          name
        }
      }
    }
  }
`;

const customStyles = {
  control: base => ({
    ...base,
    color: "#333",
    marginBottom: "16px"
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
  withNotif(
    "Skills are successfully updated",
    "Error, skills have not been updated correctly"
  ),
  graphql(addSkill, { name: "addSkillMutation" }),
  graphql(removeSkill, { name: "removeSkillMutation" }),
  withFormik({
    mapPropsToValues: props => ({
      agentSkills: props.skills
    }),
    validationSchema: Yup.object().shape({
      agentSkills: Yup.object().required("Classification is a required field")
    })
  })
)(
  ({
    client,
    setFieldValue,
    values,
    addSkillMutation,
    onSuccess,
    onError,
    data,
    providerId,
    removeSkillMutation,
  }) => {
    const editSkills = val => {
      let removed = values.agentSkills.filter(
        o => !val.some(o2 => o.value == o2.value)
      );
      let added = val.filter(
        o => !values.agentSkills.some(o2 => o.value == o2.value)
      );
      if (removed.length > 0) {
        let relToDelete = data.viewer.myAgent.agentSkillRelationships.filter(
          r => r.resourceClassification.id == removed[0].value)
        removed.map(r => {
            removeSkillMutation({
              variables: {
                token: localStorage.getItem("oce_token"),
                id: Number(relToDelete[0].id)
              }
            })
            .then(res => {
                setFieldValue("agentSkills", val);
                onSuccess()}
            )
            .catch(err => onError());
        })
      } else {
        addSkillMutation({
          variables: {
            token: localStorage.getItem("oce_token"),
            skillId: added[0].value,
            agentId: providerId
          },
          update: (store, { data }) => {
            let skills = store.readQuery({
              query: GET_SKILLS,
              variables: {
                token: localStorage.getItem("oce_token")
              }
            });
            skills.viewer.myAgent.agentSkills.push(
              data.createAgentResourceClassification.agentResourceClassification
                .resourceClassification
            );
            store.writeQuery({
              query: GET_SKILLS,
              data: skills,
              variables: {
                token: localStorage.getItem("oce_token")
              }
            });
          }
        })
          .then(res => {
              setFieldValue("agentSkills", val);
              return onSuccess()
          })
          .catch(err => onError());
      }
    };
    return (
      <Field
        name="agentSkills"
        render={({ field }) => (
          <AsyncSelect
            placeholder="Add more skills..."
            defaultOptions
            cacheOptions
            isClearable={false}
            isMulti
            value={field.value}
            styles={customStyles}
            onChange={val => editSkills(val)}
            loadOptions={val => getAllResources(client, val)}
          />
        )}
      />
    );
  }
);
