import React from "react";
import Output from './output'
export default props =>
  props.outputs.map((output, i) => (
    <React.Fragment key={i}>
      <Output 
        data={output}
        processId={props.processId}
        scopeId={props.scopeId}
        providerId={props.providerId}
        percentage={props.percentage}
      />
    </React.Fragment>
  ))
