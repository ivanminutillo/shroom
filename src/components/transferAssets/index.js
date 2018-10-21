import React from "react";
import Log from "../logEvent/styled";
import { Icons, Input, Button, Textarea } from "oce-components/build";
import Select from "react-select";
import CreatableSelect from "react-select/lib/Creatable";
import styled from "styled-components";
import { clearFix, placeholder } from "polished";
import { withFormik, Form, Field } from "formik";
import Alert from "../../components/alert";
import * as Yup from "yup";
import { compose, withHandlers, withState } from "recompose";
import media from "styled-media-query";
// import BoxHeader from "../smartSentence/boxHeader";
import postTx, { newTx } from "../../xhr/socialwallet";
import axios from 'axios'

const customStyles = {
  control: base => ({
    ...base,
    width: "380px",
    float: "left",
    marginRight: "10px",
    background: "#4F576C",
    border: "1px solid #7D849A50",
    color: "#f0f0f0"
  }),
  placeholder: base => ({
    ...base,
    color: "#f0f0f0",
    fontSize: "14px"
  })
};

const tagStyles = {
  control: base => ({
    ...base,
    border: "none",
    backgroundColor: "#42495c",
    borderRadius: 0
  }),
  placeholder: base => ({
    ...base,
    color: "#f0f0f0",
    fontSize: "14px"
  })
};

const First = styled.div`
  margin: 8px;
  ${media.lessThan("medium")`
    & > div > div {
      width: 100%;
    }
  `};
  ${clearFix()} & select {
    width: 470px;
    float: left;
    margin-right: 10px;
    ${media.lessThan("medium")`
    width: 100%;
    margin: 0;
    `};
  }
`;
const Qty = styled.div`
  float: left;
  width: 203px;
  height: 36px;
  border-radius: 4px;
  ${media.lessThan("medium")`
    width: 100%;
    left: 0;
    margin: 0;
    margin-top: 8px;
    `};
  & input {
    height: 38px;
    margin: 0;
    padding: 0 8px;
    border: none;
    background: #4f576c;
    color: #f0f0f0;
    border: 1px solid #7d849a50;
    ${placeholder({ color: "#f0f0f0" })};
  }
`;
const Second = styled.div``;

const Transfer = ({
  handleMenuSelection,
  agents,
  touched,
  errors,
  id,
  isWallet,
  setFieldValue,
  txs,
  addTx,
  menuSelected
}) => {
  let options = [];
  agents.map((agent, i) =>
    options.push({
      value: agent.subject.id,
      label: agent.subject.name
    })
  );
  return (
    <Form>
      <Log.Module>
        {/* <BoxHeader
          isWallet={isWallet}
          menuSelected={menuSelected}
          handleMenuSelection={handleMenuSelection}
        /> */}
        <First>
          <Field
            name="username"
            render={({ field }) => (
              <Select
                name={field.name}
                onChange={value => setFieldValue("username", value.value)}
                styles={customStyles}
                options={options}
                placeholder="Choose the receiver..."
              />
            )}
          />
          {touched.username &&
            errors.username && <Alert>{errors.username}</Alert>}
          <Qty>
            <Field
              name="amount"
              render={({ field }) => (
                <Input
                  name={field.name}
                  onChange={field.onChange}
                  placeholder="00.00"
                  type="number"
                />
              )}
            />
            {touched.amount && errors.amount && <Alert>{errors.amount}</Alert>}
          </Qty>
        </First>
        <Log.Note>
          <Textarea placeholder={"Add a more detailed description..."} />
        </Log.Note>
        <Second>
          <Field
            name="tag"
            render={({ field }) => (
              <CreatableSelect
                isClearable
                styles={tagStyles}
                onChange={value => {
                  let newarr = value.map(val => val.value);
                  return setFieldValue("tag", newarr);
                }}
                isMulti
                placeholder="Select one or more tags"
              />
            )}
          />
          {touched.tag && errors.tag && <Alert>{errors.tag}</Alert>}
        </Second>
        <Log.PublishActions>
          <Button type="submit">Publish</Button>
        </Log.PublishActions>
      </Log.Module>
    </Form>
  );
};

export default compose(
  withFormik({
    mapPropsToValues: () => ({ username: "", amount: "00.00", tag: [] }),
    validationSchema: Yup.object().shape({
      username: Yup.string().required(),
      amount: Yup.number().required(),
      tag: Yup.array()
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
      axios({
        method: "POST",
        url: 'http://fairchains.xicnet.com:3197/wallet/v1/transactions/new',
        headers: { "content-type": "application/json" },
        data: JSON.stringify({
          "blockchain": "mongo",
          "from-id": String(props.id),
          "to-id": String(values.username),
          "amount": String(values.amount),
          "tags": values.tag

        })
      })
        .then(res => {
         let tx = props.addTx(props.agents, res.data)
         return props.addToTxChain(tx)
        })
        .catch(err => console.log(err));
    }
  })
)(Transfer);
// export default props => (
//   <div className={style.wrapper}>
//     <h2 className={style.wrapper_title}>Publish a new transaction</h2>
//     <div className={style.wrapper_first}>
//       <Select placeholder='Choose the receiver...' className={style.customSelect} />
//       <div className={style.customInput}>
//         <Input type="number" placeholder="00.00" />
//       </div>
//     </div>
//     <div className={style.wrapper_second}>

//     </div>
//     <div className={style.wrapper_actions}>
//       <Button>Publish</Button>
//     </div>
//   </div>
// );
