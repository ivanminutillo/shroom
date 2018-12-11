import React from "react";
import s from "styled-components";
import { clearFix } from "polished";
import Button from "../../atoms/button";
import Input from "../../atoms/input.tsx";
import Textarea from "../../atoms/textarea.tsx";
import { Form, Field, withFormik } from "formik";
import Alert from "../../components/alert";
import * as Yup from "yup";
import { compose } from "recompose";
import withNotif from "../../components/notification";
import { graphql } from "react-apollo";
import updateSettings from '../../mutations/updateSettings'

export default compose(
    withNotif(
        "Personal info are successfully updated",
        "Error, info has not been updated correctly"
    ),
    graphql(updateSettings, {name: 'mutateSettings'}),
    withFormik({
      mapPropsToValues: props => ({
        name: props.agent.name || "",
        email: props.agent.email || "",
        note: props.agent.note || ""
      }),
      validationSchema: Yup.object().shape({
        name: Yup.string(),
        email: Yup.string(),
        note: Yup.string()
      }),
      handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
        return props
          .mutateSettings({
            variables: {
              id: props.agent.id,
              name: values.name,
              email: values.email,
              image: values.image,
              note: values.note,
              token: localStorage.getItem("oce_token")
            }
          })
          .then(res => props.onSuccess())
        .catch(err => props.onError());
      }
    })
  )(({agent, errors, touched}) => (
  <Form>
    <Item>
      <Photo style={{ backgroundImage: `url(${agent.image})` }} />
    </Item>
    <Item>
      <H5>Name</H5>
      <Field name="name" render={({ field }) => <Input {...field} />} />
      {errors.name && touched.name && <Alert>{errors.name}</Alert>}
    </Item>
    <Item>
      <H5>Email</H5>
      <Field name="email" render={({ field }) => <Input {...field} />} />
      {errors.email && touched.email && <Alert>{errors.email}</Alert>}
    </Item>
    <Item>
      <H5>Bio</H5>
      <Field name="note" render={({ field }) => <Textarea {...field} />} />
      {errors.note && touched.note && <Alert>{errors.note}</Alert>}
    </Item>
    <Button type='submit'>Save changes</Button>
  </Form>
));


const H5 = s.h5`
  font-size: 14px;
  color:${props => props.theme.color.p900};
  font-weight: 400;
  margin: 0;
  margin-bottom: 5px;
`;
const Photo = s.div`
float: left;
margin-left: 10px;
width: 90px;
height: 90px;
border-radius: 4px;
background: #DCDCDC;
margin: 0 auto;
margin-top: 10px;
background-size: cover;
`;
const Item = s.div`
${clearFix()}
margin-bottom: 16px;
`;