import React from "react";
import Timeline from "react-visjs-timeline";
import moment from "moment";
import styled from "styled-components";
import "vis/dist/vis.min.css";
import { compose, withState, withHandlers } from "recompose";

export default compose(
  withState("selectedItem", "onSelection", null),
  withHandlers({
    selectHandler: props => (item)  => {
      let selected = props.inputs.filter(i => i.id === item.id)
      console.log(selected)
      return props.onSelection(selected[0])
    }

  })

  )(
  ({ inputs, onInput, start, selectedItem, selectHandler, end, deleteReq }) => {
    let items = inputs.map(i => ({
      id: i.id,
      start: i.start ? i.start : new Date(),
      end: i.due,
      note: i.note,
      content: `${i.action} ${i.numericValue} ${i.unit.label} of ${
        i.affectedResourceClassifiedAsId.label
      }`
    }));
    const setOption = deleteReq => ({
      width: "100%",
      selectable: true,
      editable: true,
      start: start,
      end: end,
      type: "range",
      visibleFrameTemplate: function(item) {
        if (item.visibleFrameTemplate) {
          return item.visibleFrameTemplate;
        }
        return '<div class="progress-wrapper">' + item.note + "<label></div>";
      },
      onMove: (item, callback) => {
        selectHandler(item)
        let index = inputs.findIndex(n => n.id === item.id);
        let newInputs = inputs;
        newInputs[index].start = moment(item.start);
        newInputs[index].due = moment(item.end);
        onInput(newInputs);
        callback(item);
      },
      onAdd: (item, callback) => {
        callback(item);
      },
      onRemove: (item, callback) => {
        deleteReq(item.id);
        callback(item);
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
        {selectedItem ? <SelectedItem>{selectedItem.note}</SelectedItem> : null}
        <Timeline
          editable={true}
          options={setOption(deleteReq)}
          items={items}
        />
      </Wrapper>
    );
  }
);

const Wrapper = styled.div`
  margin: 0 10px;
`;

const SelectedItem = styled.div`
  margin: 10px 0;
`;
