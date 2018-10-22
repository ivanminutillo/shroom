import React from "react";
import { graphql, compose } from "react-apollo";
import { Icons, Button, Input } from "oce-components/build";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import Alert from "../../components/alert";
import LoginMutation from "../../mutations/login";
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 320px;
  margin: 0 auto;
  margin-top: 20px;
`;

const Title = styled.h3`
  margin-top: 80px;
  font-size: 16px;
  letter-spacing: 3px;
`;

const Header = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
  & h1 {
    font-size: 42px;
    font-weight: 900;
  }
  & h3 {
    margin-top: 16px;
    font-weight: 300;
  }
`;

const Body = styled.div`
  & input {
    margin-bottom: 16px;
    background: #1f2129;
    color: #f0f0f0;
  }
`;

const Login = ({ touched, errors }) => {
  return (
    <Wrapper>
      <Title>shroom.</Title>
      <Header>
        <h1>Welcome back</h1>
        <h3 data-testid="desc">
          in your wannabe federated p2p economic network
        </h3>
      </Header>
      <Body>
        <Form>
          <div>
            <Field
              name="username"
              render={({ field }) => (
                <Input
                  value={field.value}
                  name={field.name}
                  onChange={field.onChange}
                  placeholder="Insert your username"
                />
              )}
            />
            {touched.username &&
              errors.username && <Alert>{errors.username}</Alert>}
          </div>
          <div>
            <Field
              name="password"
              render={({ field }) => (
                <Input
                  value={field.value}
                  name={field.name}
                  onChange={field.onChange}
                  type="password"
                  placeholder="Insert your password"
                />
              )}
            />
            {touched.password &&
              errors.password && <Alert>{errors.password}</Alert>}
          </div>
          <Button type='submit' data-testid="login">login</Button>
        </Form>
      </Body>
    </Wrapper>
  );
};

export default compose(
  graphql(LoginMutation),
  graphql(updateNotification, { name: "updateNotification" }),
  graphql(deleteNotification, { name: "deleteNotification" }),
  withFormik({
    mapPropsToValues: () => ({ username: "", password: "" }),
    validationSchema: Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string()
        .min(4)
        .required()
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
      props
        .mutate({
          variables: { username: values.username, password: values.password }
        })
        .then(
          data => {
            props
              .updateNotification({
                variables: {
                  message: (
                    <div data-testid="success">
                      <span>
                        <Icons.Bell width="18" height="18" color="white" />
                      </span>
                      Welcome :)
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
              });
            localStorage.setItem("oce_token", data.data.createToken.token);
            localStorage.setItem("agent_id", data.data.createToken.id);
            props.history.replace("/");
          },
          e => {
            const errors = e.graphQLErrors.map(error => error.message);
            props
              .updateNotification({
                variables: {
                  message: (
                    <div data-testid="error">
                      <span>
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
            setSubmitting(false);
          }
        );
    }
  })
)(Login);
