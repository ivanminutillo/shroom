import { compose } from "recompose";
import moment from "moment";
import { withFormik } from "formik";
import * as Yup from "yup";

import LogEvent from "./logEvent";
require("react-datepicker/dist/react-datepicker-cssmodules.css");

export default compose(
  withFormik({
    mapPropsToValues: props => ({
      action: props.action,
      note: "",
      numericValue: "00.00" || "",
      unit: null,
      due: moment(),
      start: moment(),
      affectedResourceClassifiedAsId: null
    }),
    validationSchema: Yup.object().shape({
      action: Yup.string().required(),
      note: Yup.string(),
      numericValue: Yup.number(),
      unit: Yup.object(),
      due: Yup.string().required(),
      start: Yup.string().required(),
      affectedResourceClassifiedAsId: Yup.object().required()
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
      let i = {
        action: props.action,
        start: values.start,
        due: values.due,
        note: values.note,
        numericValue: values.numericValue,
        unit: values.unit,
        affectedResourceClassifiedAsId:
        values.affectedResourceClassifiedAsId,
        type: props.type,
        id: props.inputs.length
      };
      console.log(props.closeLogEvent)
      props.inputs.push(i);
      props.onInput(props.inputs);
      props.closeLogEvent();
      return null
    }
  })
)(LogEvent);
