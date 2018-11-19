import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { Icons } from "oce-components";
import Button from "../../atoms/button";
import moment from "moment";
import AddProvider, { DeleteProvider } from "../../components/addProvider";

export default props =>
  props.outputs.map((output, i) => (
    <React.Fragment key={i}>
      <Wrapper key={i}>
        <Result>
          <Tagline>Result</Tagline>
          <Container>
            <Bar percentage={props.percentage} />
            <ResultTitle>{`${output.action} ${
              output.committedQuantity.numericValue
            } ${output.committedQuantity.unit.name} of ${
              output.resourceClassifiedAs.name
            }`}</ResultTitle>
            <Note>{output.note}</Note>
            <Date>
              <span>
                <Icons.Clock width="16" height="16" color="#F0F0F0" />
              </span>
              {moment(output.due).format("DD MMM")}
            </Date>
          </Container>
          <Actions>
          <Button>Complete this output</Button>
          <Take>
          {output.provider ? (
            <Img style={{ backgroundImage: `url(${output.provider.image})` }} />
          ) : null}
          {!output.provider ? (
              <AddProvider providerId={props.myId} intentId={output.id} />
          ) : output.provider && output.provider.id === props.myId ? (
              <DeleteProvider intentId={output.id} />
          ) : null}
          {output.provider && output.provider.id === props.myId ?
          `${output.provider.name} has committed to it`
        : 'Take this commitment'}
        </Take>
        </Actions>
        </Result>
        
      </Wrapper>
    </React.Fragment>
  ));

  const Img = styled.div`
  display: inline-block;
  height: 24px;
  width: 24px;
  border-radius: 40px;
  background-size: cover;
  background-color: ${props => props.theme.color.p600};
  margin: 0;
  vertical-align: bottom;
  margin-right: 8px;
`

const Wrapper = styled.div`
  display: grid;
  margin-top: 26px;
  grid-template-columns: 1fr;
  grid-column-gap: 24px;
`;
const Result = styled.div``;
const Tagline = styled.h3`
  margin-bottom: 10px;
  color: ${props => props.theme.color.p800};
  letter-spacing: 0.5px;
`;
const Container = styled.div`
  background: #d6e1e3;
  border-radius: 3px;
  padding: 8px;
`;
const ResultTitle = styled.h2`
  color: #603e30;
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
    background: #d6825f;
    display: block;
  }
`;
const Date = styled.div`
  background: #e18964;
  border-radius: 3px;
  height: 26px;
  padding: 0 8px;
  line-height: 26px;
  color: #f0f0f0;
  display: inline-block;
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
  }
`;
const Bar = styled.div`
  height: 4px;
  border-radius: 4px;
  background: #40454c;
  margin-bottom: 24px;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    width: ${props => props.percentage}%;
    height: 4px;
    background-color: #29a67b;
    border-radius: 4px;
    display: block;
    left: 0;
    top: 0;
  }
`;
const Take = styled.div`
  margin-top: 16px;
  color: ${props => props.theme.color.p800};
  font-size: 14px;
  letter-spacing: 0.5px;
  & span {
    margin-right: 8px;
    vertical-align: sub;
    display: inline-block;
  }
`;
