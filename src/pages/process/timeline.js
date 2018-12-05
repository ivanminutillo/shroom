import React from "react";
import Timeline from "react-visjs-timeline";
import 'vis/dist/vis.min.css'

const options = {
  width: "100%",
  format: {
    minorLabels: {
      minute: "h:mma",
      hour: "ha"
    }
  }
};

export default ({inputs}) => {
    let items = inputs.map((i, j) => ({
        id: j,
        start: i.plannedStart ? i.plannedStart : new Date(),
        end: i.due,
        content: `${i.action} ${i.committedQuantity.numericValue} ${
            i.committedQuantity.unit.name
          } of ${i.resourceClassifiedAs.name}`
    }))
  return <Timeline editable={true} options={options} items={items} />;
};
