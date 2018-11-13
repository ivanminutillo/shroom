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
    console.log(start)
    console.log(end)

  let items = inputs.map(i => ({
    id: i.id,
    start: i.plannedStart ? i.plannedStart : new Date(),
    end: i.due,
    note: i.note,
    content: `${i.action} ${i.committedQuantity.numericValue} ${
      i.committedQuantity.unit.name
    } of ${i.resourceClassifiedAs.name}`
  }));
  const setOption = () => ({
    width: "100%",
    start: start ? moment(start) : new Date(),
    end: end ? moment(end) : new Date(),
    type: "range",
    visibleFrameTemplate: function(item) {
      if (item.visibleFrameTemplate) {
        return item.visibleFrameTemplate;
      }
      return '<div class="progress-wrapper">' + item.note + "<label></div>";
    },

    timeAxis: { scale: "day", step: 1 },
    format: {
      minorLabels: {
        minute: "h:mma",
        hour: "ha"
      }
    }
  });

  return (
    <Wrapper>
      <Timeline options={setOption(deleteReq)} items={items} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 0 10px;
`;
