import React from "react";
import Modal from "../modal";
import { Feed } from "oce-components/build";
import styled from "styled-components";
import getResourceClassification from "../../queries/getResourceClassification";
import { LoadingMini, ErrorMini } from "../../components/loading";
import { Query } from "react-apollo";
import Markdown from "markdown-to-jsx";
import { placeholder } from "polished";

const Preview = styled.div`
  padding: 10px;
`;

const SupTitle = styled.h2`
  color: ${props => props.theme.color.p900};
`;

const Content = styled.div`
  margin-top: 8px;
  border-bottom: 1px solid #dadada80;
  padding-bottom: 16px;
  margin-bottom: 8px;
  color: ${props => props.theme.color.p800} !important;
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6,
  & p,
  & u,
  & i,
  & b,
  & ul,
  & a,
  & li {
    color: ${props => props.theme.color.p800};
  }
`;

const EventAssociated = styled.div`
  padding-left: 10px;
`;
const Footer = styled.div`
  background: ${props => props.theme.color.p200};
  height: 40px;
`;
const Actions = styled.div`
  float: right;
`;

const Item = styled.div`
  margin-top: 8px;
`;

const Cancel = styled.button`
  height: 30px;
  margin-top: 5px;
  border-radius: 3px;
  margin-right: 8px;
  font-size: 13px;
  width: 80px;
  border: none;
`;
const Publish = styled.button`
  height: 40px;
  background: ${props => props.theme.color.b100};
  color: #f0f0f0;
  border: none;
  width: 120px;
  border-bottom-left-radius: 4px;
  font-size: 13px;
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p900};
`;

const Block = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p100};
  padding: 8px;
  height: 24px;
  line-height: 24px;
  display: inline-block;
  border-radius: 3px;
  margin-bottom: 16px;
  background: ${props => props.theme.color.b200};
`;

const B = styled.b`
  text-decoration: underline;
  font-weight: 500;
  color: ${props => props.theme.color.p900};
`;

const HelperModal = ({
  modalIsOpen,
  toggleModal,
  economicEvent,
  providerImage,
  providerName,
  logEvent
}) => {
  const first_rgx = /(\[)(.*?)(?=\:)/g;
  const second_rgx = /[^a-zA-Z0-9. ]/g;
  const subst = ``;
  const result = economicEvent.message.replace(first_rgx, subst);
  return (
    <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
      <Preview>
        <SupTitle>Message preview</SupTitle>
        <Content>{result}</Content>
      </Preview>
      {modalIsOpen &&
      economicEvent.event &&
      economicEvent.amount &&
      economicEvent.taxonomy ? (
        <Query
          query={getResourceClassification}
          variables={{
            token: localStorage.getItem("oce_token"),
            id: economicEvent.taxonomyId
          }}
        >
          {({ loading, error, data, refetch }) => {
            if (loading) return <LoadingMini />;
            if (error)
              return (
                <ErrorMini
                  refetch={refetch}
                  message={`Error! ${error.message}`}
                />
              );
            return (
              <div>
                <EventAssociated>
                  <SupTitle>Event associated</SupTitle>

                  <Item>
                    <Feed
                      image={providerImage}
                      primary={
                        <FeedItem>
                          <B>{providerName}</B>
                          {` ${economicEvent.event} ${economicEvent.amount} ${
                            data.viewer.resourceClassification.unit.name
                          } of ${economicEvent.taxonomy} in ${
                            economicEvent.process
                          }`}
                        </FeedItem>
                      }
                      // date={moment()}
                    />
                  </Item>
                </EventAssociated>
                <Footer>
                  <Actions>
                    <Cancel onClick={toggleModal}>Cancel</Cancel>
                    <Publish
                      onClick={() =>
                        logEvent(
                          result,
                          data.viewer.resourceClassification.unit.id
                        )
                      }
                    >
                      Publish
                    </Publish>
                  </Actions>
                </Footer>
              </div>
            );
          }}
        </Query>
      ) : null}
    </Modal>
  );
};

export default HelperModal;
