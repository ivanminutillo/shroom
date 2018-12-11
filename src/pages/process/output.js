import React from "react";
import styled from "styled-components";
import Button from "../../atoms/button";
import { Form, Field } from "formik";
import Alert from "../../components/alert";
import Textarea from "../../atoms/textarea.tsx";
import  Icons  from "../../atoms/icons.tsx";
import Input from "../../atoms/input.tsx";
import { clearFix, placeholder } from "polished";
import moment from "moment";
import { compose, withState, withHandlers } from "recompose";
import { withFormik } from "formik";
import * as Yup from "yup";
import { event } from "../../fragments/economicEvents";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import withNotif from "../../components/notification";
import createResource from "../../mutations/createResource";
import Feed from "../../components/FeedItem/index.tsx";

export default compose(
  withNotif(
    "Event successfully added",
    "Error, the event has not been created"
  ),
  graphql(createResource, { name: "createEventMutation" }),
  withState("output", "onOutput", false),
  withHandlers({
    toggleOutput: props => () =>  props.onOutput(!props.output)
  }),
  withFormik({
    mapPropsToValues: props => ({
      note: "",
      numericValue: "00.00" || "",
      date: moment(),
      url: ""
    }),
    validationSchema: Yup.object().shape({
      note: Yup.string(),
      numericValue: Yup.number(),
      date: Yup.string(),
      url: Yup.string()
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
      let date = moment(values.date).format("YYYY-MM-DD");
      let eventMutationVariables = {
        token: localStorage.getItem("oce_token"),
        id: props.providerId,
        createResource: true,
        providerId: props.providerId,
        receiverId: props.scopeId,
        outputOfId: props.processId,
        commitmentId: props.data.id,
        action: props.data.action,
        scopeId: props.scopeId,
        affectedUnitId: props.data.committedQuantity.unit.id,
        note: values.note,
        affectedNumericValue: values.numericValue,
        start: date,
        affectedResourceClassifiedAsId: props.data.resourceClassifiedAs.id
      };
      return props
        .createEventMutation({
          variables: eventMutationVariables,
          update: (store, { data }) => {
            const fragment = gql`
              fragment Comm on Process {
                id
                committedOutputs {
                  id
                  fulfilledBy {
                    fulfilledBy {
                      ...BasicEvent
                    }
                  }
                }
              }
              ${event}
            `;
            const process = store.readFragment({
              id: `Process-${props.processId}`,
              fragment: fragment,
              fragmentName: "Comm"
            });
            const ev = {
                __typename: "Fulfillment",
                fulfilledBy: {
                __typename: "EconomicEvent",
                action: data.createEconomicEvent.economicEvent.action,
                requestDistribution:
                data.createEconomicEvent.economicEvent.requestDistribution,
                start: data.createEconomicEvent.economicEvent.start,
                id: data.createEconomicEvent.economicEvent.id,
                scope: data.createEconomicEvent.economicEvent.scope,
                note: data.createEconomicEvent.economicEvent.note,
                provider: data.createEconomicEvent.economicEvent.provider,
                inputOf: data.createEconomicEvent.economicEvent.inputOf,
                isValidated: false,
                fulfills: data.createEconomicEvent.economicEvent.fulfills,
                validations: [],
                affects: data.createEconomicEvent.economicEvent.affects,
                affectedQuantity:
                data.createEconomicEvent.economicEvent.affectedQuantity
              }
            };
            let index = process.committedOutputs.findIndex(x => x.id === props.data.id)
            process.committedOutputs[index].fulfilledBy.unshift({
              ...ev
            });
            store.writeFragment({
              id: `Process-${props.processId}`,
              fragment: fragment,
              fragmentName: "Comm",
              data: process
            });
          }
        })
        .then(res => {
          return props.onSuccess();
        })
        .catch(err => props.onError());
    }
  })
)(props => (
  <Wrapper>
    <Result>
      <Container>
        <Bar percentage={props.percentage} />
        <ResultTitle>{`${props.data.action} ${
          props.data.committedQuantity.numericValue
        } ${props.data.committedQuantity.unit.name} of ${
          props.data.resourceClassifiedAs.name
        }`}</ResultTitle>
        <Note>{props.data.note}</Note>
        <Date>
          <span>
            <Icons.Clock width="16" height="16" color="#603e30" />
          </span>
          {moment(props.data.due).format("DD MMM")}
        </Date>
        {props.data.fulfilledBy.map((ev, i) => (
          <Feed
            scopeId={props.scopeId}
            image={ev.fulfilledBy.provider ? ev.fulfilledBy.provider.image : null}
            commitmentId={null}
            key={i}
            id={ev.id}
            loggedUserId={props.providerId}
            providerId={ev.fulfilledBy.provider ? ev.fulfilledBy.provider.id : null}
            withDelete
            validations={ev.fulfilledBy.validations}
            openValidationModal={props.openValidationModal}
            primary={
              <FeedItem>
                <B>{ev.fulfilledBy.provider ? ev.fulfilledBy.provider.name : null}</B>{" "}
                {ev.fulfilledBy.action +
                  " " +
                  ev.fulfilledBy.affectedQuantity.numericValue +
                  " " +
                  ev.fulfilledBy.affectedQuantity.unit.name +
                  " of "}
                <i>{ev.fulfilledBy.affects.resourceClassifiedAs.name}</i>
              </FeedItem>
            }
            secondary={ev.fulfilledBy.note}
            date={moment(ev.fulfilledBy.start).format("DD MMM")}
          />
        ))}
        <Actions>
          {props.output ? (
            <FeedList>
              <WrapperLogEvent>
                <Title>Create a new resource</Title>
                <Form>
                  <Qty>
                    <label>Quantity</label>
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
                        />
                      )}
                    />
                    {props.errors.numericValue &&
                      props.touched.numericValue && (
                        <Alert>{props.errors.numericValue}</Alert>
                      )}
                  </Qty>
                  <ResourceNote>
                    <NoteIcon>
                      <Icons.Text width="16" height="16" color="#b7bfc6" />
                    </NoteIcon>
                    <Field
                      name="note"
                      render={({ field }) => (
                        <Textarea
                          value={field.value}
                          name={field.name}
                          onChange={field.onChange}
                          placeholder={"Type a note..."}
                        />
                      )}
                    />
                  </ResourceNote>
                  <Url>
                    <Input placeholder="Type an url..." />
                  </Url>
                  <Button gray onClick={props.toggleOutput}>
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </Form>
              </WrapperLogEvent>
            </FeedList>
          ) : (
            <Footer>
            <RightButton onClick={props.toggleOutput}>
              Complete this output
            </RightButton>
            </Footer>
          )}
        </Actions>
      </Container>
    </Result>
  </Wrapper>
));

const Qty = styled.div`
  border-radius: 3px;
  max-height: 36px;
  text-align: center;
  display: inline-block;
  border: 1px solid #dadada;
  background: white;
  margin-left: 8px;
  ${clearFix()};
  & label {
    float: left;
    line-height: 36px;
    margin-left: 8px;
    font-size: 14px;
    letter-spacing: 0.5px;
    font-weight: 500;
    color: #333333ad;
    border-radius: 4px;
  }
  & input {
    width: 140px;
    float: left;
    text-align: center;
    color: #333;
    border-radius: 4px;
    ${placeholder({ color: "#333" })};
  }
`;

const Url = styled.div`
  margin: 0 10px;
`;

const Footer = styled.div`
  ${clearFix()};
  background: #ecedee;
    /* margin-left: -8px; */
    /* margin-right: -8px; */
    padding: 0 4px;
    margin-bottom: 0px;
    border-radius: 2px;
`;

const NoteIcon = styled.div`
  position: absolute;
  top: 17px;
  left: 0px;
`;

const WrapperLogEvent = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  background: #eff1f4;
`;

const RightButton = styled(Button)`
  float: right;
  width: 200px !important;
  margin-bottom: 0;
  padding: 0 5px;
  width: 160px !important;
  border-radius: 2px !important;
  width: 100%;
  height: 55px;
  line-height: 55px;
  margin-top: 0px;
  /* margin-left: 10px; */
  margin-bottom: 0px;
  display: inline-block;
  width: 100px;
  height: 34px;
  line-height: 34px;
  font-size: 13px;
  border: 1px solid #396d91;
  margin: 4px 0px !important;
`;

const ResourceNote = styled.div`
position: relative;
border-top: 1px solid #e0e6e8;;
margin: 10px;
display: flex;
${clearFix()}
  & textarea {
    margin-left: 20px;
    margin-top: 10px;
    outline: none;
    float: left
    min-height: 30px;
    resize: none;
    font-size: 14px;
    line-height: 20px;
    clear: both;
    font-weight: 400;
    overflow: hidden;
    word-wrap: break-word;
    color: #333;
    border: none;
    margin: 0;
    background: transparent;
    box-sizing: border-box;
    text-indent: 10px;
    margin-top: 10px;
    margin-left: 20px;
    padding-left: 0;
    flex: 1;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid #cccccc;
    }
    ${placeholder({ color: "#b2b2bc6" })};
  }
`;

const Title = styled.div`
  height: 30px;
  line-height: 30px;
  background: #d9dde3;
  margin-bottom: 10px;
  padding-left: 10px;
  font-size: 13px;
  color: #1c1e22b5;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p900};
`;

const B = styled.b`
  text-decoration: underline;
  font-weight: 500;
  color: ${props => props.theme.color.p900};
`;

const FeedList = styled.div`
  margin-top: 0;
  margin-bottom: 0;
`;

const Wrapper = styled.div`
  display: grid;
  margin-top: 26px;
  grid-template-columns: 1fr;
  grid-column-gap: 24px;
`;
const Result = styled.div``;

const Container = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 8px;
  border: 1px solid #e9e9e9;
  box-shadow: 0 2px 10px 0px rgba(0, 0, 0, 0.1);
  ${clearFix()};
  & button {
    float: right;
    margin-bottom: 8px;
  }
`;
const ResultTitle = styled.h2`
  color: ${props => props.theme.color.p900};
  font-size: ${props => props.theme.fontSize.h2};
  letter-spazing: 0.5px;
  margin-bottom: 16px;
  margin-top: 8px;
`;
const Note = styled.h3`
  font-weight: 300;
  color: #603e30;
  position: relative;
  margin-left: 10px;
  padding: 8px;
  padding-left: 0;
  margin-bottom: 10px;
  &:before {
    position: absolute;
    content: "";
    width: 1px;
    left: -10px;
    top: 0;
    bottom: 0;
    height: 100%;
    background: #dadada;
    display: block;
  }
`;
const Date = styled.div`
  background: #f6f6f6;
  border-radius: 5px;
  height: 26px;
  padding: 0 8px;
  line-height: 26px;
  color: #9d9d9d;
  display: inline-block;
  font-size: 13px;
  font-weight: 300;
  font-size: 13px;
  & span {
    margin-right: 4px;
    vertical-align: sub;
    display: inline-block;
  }
`;
const Actions = styled.div`
  margin-top: 8px;
  & button {
    width: 100%;
    height: 55px;
    line-height: 55px;
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 10px;

    display: inline-block;
    width: 100px;
    height: 34px;
    line-height: 34px;
  }
`;
const Bar = styled.div`
  height: 4px;
  border-radius: 14px;
  background: #dee6f2;
  margin-bottom: 10px;
  position: relative;
  border: 8px solid rgba(255, 255, 255, 0);

  &:before {
    content: "";
    position: absolute;
    width: ${props => props.percentage}%;
    height: 6px;
    background-color: #62cfa9;
    border-radius: 4px;
    display: block;
    left: 0;
    top: -3px;
  }
`;
