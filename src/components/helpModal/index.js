import React from "react";
import Modal from "../modal";
import styled from "styled-components";

const H1 = styled.h2`
  color: ${props => props.theme.color.p800}
    margin-bottom: 8px;
`

const H4 = styled.h2`
  color: ${props => props.theme.color.p800}
  margin-bottom: 8px;
`

const Wrapper = styled.div`
  padding: 16px;
  line-height: 20px;
`

const Code = styled.pre`
  display: inline-block;
  background: ${props => props.theme.color.b200};
  padding: 2px 6px;
  border-radius: 3px;
  margin: 0;
  margin-bottom: 3px;
  margin-right: 4px;
  color: #f0f0f0;
`

const HelperModal = ({
  modalIsOpen,
  toggleModal
}) => {
  return (
    <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
        <Wrapper>
            <H1>How to write an economic event</H1>
            An economic event is the resume of an activity you performed.<br />
            It consists in a message with some special annotations, that will help the machine to 
            understand exactly what you did.<br />
            Special annotations are added with special characters and they are:<br />
            <Code>!event</Code> <Code>amount</Code> <Code>#taxonomy</Code> <Code>>process</Code>
            You need to specify each of them, except the <Code>>process</Code> that is optional.<br />
            They behave like hashtags and mentions that are embedded into mostly of social networks.<br/>
            The order of the annotations are not mandatory, you can use randomly, except for the moment you need to specify the amount after the !event.
            <H4>Some examples</H4>
            <Code>I !work 10 #graphic >festival brochure</Code><br />
            <Code>I finally finished to work on the #festival-translation and it took me !work 5 to finish it.</Code><br />
            If you fulfill all the mandatory fields, the right cross icon will be replaced by another one and you can publish your activity.
        </Wrapper>
    </Modal>
  );
};

export default HelperModal;
