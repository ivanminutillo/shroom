import React from "react";
import Timeline from "react-visjs-timeline";
import styled from "styled-components";
import moment from 'moment'
import "vis/dist/vis.min.css";



export default ({
  inputs,
  start,
  end,
  deleteReq
}) => {
  let items = inputs.map(i => ({
    id: i.id,
    start: i.plannedStart ? moment(i.plannedStart) : moment(start),
    end: i.due ? moment(i.due) : moment(end),
    note: i.note,
    type: !i.plannedStart || !i.due || i.plannedStart === i.due ? 'box' : 'range',
    content: `${i.action} ${i.committedQuantity.numericValue} ${
      i.committedQuantity.unit.name
    } of ${i.resourceClassifiedAs.name}`
  }));
  let options = {
    width: "100%",
    start:  new Date(start),
    end: new Date(end),
    zoomMin: 100000,
    visibleFrameTemplate: function(item) {
      if (item.visibleFrameTemplate) {
        return item.visibleFrameTemplate;
      }
      return '<div class="progress-wrapper">' + item.note + "<label></div>";
    },

    // timeAxis: { scale: "day" },
    autoResize: false,
    format: {
        minorLabels: {
          minute: "h:mma",
          hour: "ha"
        }
      }
  };

  return (
    <Wrapper>
      <Timeline options={options} items={items} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 0 10px;
`;
