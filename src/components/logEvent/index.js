import { compose } from "recompose";
import Component from "./logEvent";
import moment from "moment";
import { withFormik } from "formik";
import * as Yup from "yup";
import createEvent from "../../mutations/createEvent";
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import React from "react";
import { Icons } from "oce-components/build";
import { graphql } from "react-apollo";

const wrapperComponent = compose(
  graphql(createEvent, { name: "createEventMutation" }),
  graphql(deleteNotification, { name: "deleteNotification" }),
  graphql(updateNotification, { name: "updateNotification" }),

  withFormik({
    mapPropsToValues: props => ({
      action: "",
      note: "",
      numericValue: "00.00" || "",
      unit: "",
      date: moment(),
      affectedResourceClassifiedAsId: ""
    }),
    validationSchema: Yup.object().shape({
      action: Yup.string().required(),
      note: Yup.string(),
      numericValue: Yup.number(),
      unit: Yup.string().required(),
      date: Yup.string(),
      affectedResourceClassifiedAsId: Yup.string().required(
        "Classification is a required field"
      )
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
      let date = moment(values.date).format("YYYY-MM-DD");
      let eventMutationVariables = {
        token: localStorage.getItem("oce_token"),
        id: props.providerId,
        providerId: props.providerId,
        receiverId: props.scopeId,
        action: values.action,
        scopeId: props.scopeId,
        note: values.note,
        affectedNumericValue: values.numericValue,
        affectedUnitId: values.unit,
        start: date,
        affectedResourceClassifiedAsId: values.affectedResourceClassifiedAsId
      };
      console.log(eventMutationVariables);
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
              }
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
    }
  })
)(Component);

export default wrapperComponent;
