import React from "react";
import styled, { css } from "styled-components";
import { clearFix } from "polished";
import moment from "moment";
import { Icons } from "oce-components";
import { NavLink } from "react-router-dom";
import LogEvent from "../logEvent/index";
import Feed from "../../components/FeedItem";
import AddProvider, { DeleteProvider } from "../addProvider";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getComm from "../../queries/getCommitment";
import CommitmentStatus from "../commitmentStatus";
import EditDueDate from "../editDueDate";
import { withHandlers, withState, compose } from "recompose";
import EditSentence from "./editSentence";
import EditNote from "./editNote";
import ButtonDeleteIntent from '../deleteIntent'

const Intent = ({
  intentId,
  providerId,
  addIntent,
  isSentenceOpen,
  isNoteOpen,
  handleSentenceOpen,
  handleNoteOpen,
  scopeId,
  toggleModal
}) => {
  return (
    <Query
      query={getComm}
      variables={{
        token: localStorage.getItem("oce_token"),
        id: intentId
      }}
    >
      {({ loading, error, data, refetch, fetchMore, client }) => {
        if (loading) return <LoadingMini />;
        if (error)
          return (
            <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
          );
        let intent = data.viewer.commitment;
        return (
          <Wrapper>
            <First>
              {isSentenceOpen ? (
                <EditSentence
                  client={client}
                  handleSentenceOpen={handleSentenceOpen}
                  intent={intent}
                />
              ) : (
                <Sentence onClick={handleSentenceOpen}>
                  {intent.outputOf ? (
                    <ContainerTitle>
                      <Icons.UpRight width="16" height="16" color="#36393F" />
                    </ContainerTitle>
                  ) : (
                    <ContainerTitle>
                      <Icons.UpLeft width="16" height="16" color="#36393F" />
                    </ContainerTitle>
                  )}
                  {`${intent.action} ${intent.committedQuantity.numericValue} ${
                    intent.committedQuantity.unit.name
                  } ${intent.resourceClassifiedAs.name}`}
                </Sentence>
              )}
              {isNoteOpen ? (
                <EditNote intent={intent} handleNoteOpen={handleNoteOpen} />
              ) : intent.note ? (
                <Note onClick={handleNoteOpen}>{intent.note}</Note>
              ) : (
                <AddNote onClick={handleNoteOpen}>
                  <Span>
                    <Icons.Plus width="18" height="18" color="#36393F" />
                  </Span>
                  Add a note...
                </AddNote>
              )}
            </First>
            <Second>
              <EditDueDate due={intent.due} intentId={intent.id} />
              <CommitmentStatus
                intentId={intent.id}
                isFinished={intent.isFinished}
              />
              <Members>
                <Span>
                  <Icons.Users width="18" height="18" color="#8D8D8D" />
                </Span>
                {intent.provider ? (
                  <Img
                    style={{ backgroundImage: `url(${intent.provider.image})` }}
                  />
                ) : null}
                {!intent.provider || intent.provider.id !== providerId ? (
                  <AddProvider providerId={providerId} intentId={intent.id} />
                ) : intent.provider && intent.provider.id === providerId ? (
                  <DeleteProvider intentId={intent.id} />
                ) : null}
              </Members>
            </Second>
            <Section>
              {intent.plan ? (
                <Nav>
                  <span>Plan</span>{" "}
                  <NavLink to={"/plan/" + intent.plan.id}>
                    {intent.plan.name}
                  </NavLink>
                </Nav>
              ) : null}
              {intent.inputOf || intent.outputOf ? (
                <Nav process>
                  <span>Process</span>{" "}
                  <NavLink to="">
                    <Process>
                      <Content>
                        {intent.inputOf
                          ? intent.inputOf.name
                          : intent.outputOf.name}
                      </Content>
                    </Process>
                  </NavLink>
                </Nav>
              ) : null}
            </Section>
            <div>
              <Suptitle>Activities</Suptitle>
              {intent.fulfilledBy
                ? intent.fulfilledBy.map((ev, i) => (
                    <Feed
                      commitmentId={intent.id}
                      scopeId={scopeId}
                      light
                      loggedUserId={providerId}
                      providerId={ev.fulfilledBy.provider.id}
                      image={ev.fulfilledBy.provider.image}
                      key={i}
                      id={ev.fulfilledBy.id}
                      withDelete
                      primary={
                        <FeedItem>
                          <B>{ev.fulfilledBy.provider.name}</B>{" "}
                          {ev.fulfilledBy.action +
                            " " +
                            ev.fulfilledBy.affectedQuantity.numericValue +
                            " " +
                            ev.fulfilledBy.affectedQuantity.unit.name +
                            " of "}
                          <i>
                            {ev.fulfilledBy.affects.resourceClassifiedAs.name}
                          </i>
                        </FeedItem>
                      }
                      secondary={ev.fulfilledBy.note}
                      date={moment(ev.fulfilledBy.start).format("DD MMM")}
                    />
                  ))
                : null}
            </div>
            <Actions>
              <LogEvent
                commitmentId={intent.id}
                providerId={providerId}
                scopeId={scopeId}
                addIntent={addIntent}
                action={intent.action}
                unit={intent.committedQuantity.unit.name}
                unitId={intent.committedQuantity.unit.id}
                resourceId={intent.resourceClassifiedAs.id}
                resource={intent.resourceClassifiedAs.name}
              />
            </Actions>
            {intent.isDeletable ? 
            <DeleteIntent>
              <ButtonDeleteIntent toggleModal={toggleModal} intentId={intentId} scopeId={scopeId}/>
            </DeleteIntent>
            : null
          }
          </Wrapper>
        );
      }}
    </Query>
  );
};

export default compose(
  withState("isSentenceOpen", "onSentenceOpen", false),
  withState("isNoteOpen", "onNoteOpen", false),
  withHandlers({
    handleSentenceOpen: props => () => {
      props.onSentenceOpen(!props.isSentenceOpen);
    },
    handleNoteOpen: props => () => {
      props.onNoteOpen(!props.isNoteOpen);
    }
  })
)(Intent);

const DeleteIntent = styled.div`
  height: 30px;
  margin-top: 30px;
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p800};
`;

const B = styled.b`
  text-decoration: underline;
  font-weight: 500;
  color: ${props => props.theme.color.p800};
`;

const Suptitle = styled.h3`
  font-weight: 500;
  color: ${props => props.theme.color.p300};
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: 8px;
  margin-top: 16px;
`;

const AddNote = styled.div`
  color: ${props => props.theme.color.p800};
  height: 24px;
  line-height: 24px;
  padding: 0 8px;
  cursor: pointer;
  background: #e4e6e9;
  border-radius: 2px;
  margin-top: 8px;
  display: inline-block;
  font-size: 14px;
  & div {
    margin-top: 0px;
    margin-right: 0;
  }
  &:hover {
    background: #bacbe1;
    border-color: ${props => props.theme.color.b100};
  }
`;

const Members = styled.div`
  float: left;
  margin-left: 4px;
  ${clearFix()};
`;
const Span = styled.div`
  float: left;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  cursor: pointer;
  & svg {
    margin-top: 2px;
  }
`;
const Img = styled.div`
  float: left;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 4px;
  background-color: #dedede;
`;

const Wrapper = styled.div`
  padding: 16px;
  padding-top: 8px;
  position: relative;
`;
const Section = styled.div`
  margin-top: 24px;
  position: relative;
`;
const Nav = styled.div`
  position: relative;
  font-size: 14px;
  height: 50px;
  background: #dedede;
  border-bottom: 1px solid #c5c5c5;
  margin-left: -16px;
  margin-right: -16px;
  ${props => props.theme.color.p800};
  ${props =>
    props.process &&
    css`
      & span {
      }
    `} a {
    color: ${props => props.theme.color.p800};
    letter-spacing: 1px;
    line-height: 50px;
  }
  & span {
    display: inline-block;
    height: 24px;
    background: ${props => props.theme.color.b100};
    color: ${props => props.theme.color.p100};
    border-radius: 2px;
    line-height: 24px;
    font-size: 12px;
    font-weight: 500;
    padding: 0 8px;
    margin-right: 4px;
    position: relative;
    margin-top: 13px;
    margin-left: 8px;
  }
`;

const Actions = styled.div`
  background: #434a5b;
  margin-left: -16px;
  margin-bottom: -16px;
  margin-right: -16px;
  ${clearFix()};
`;

const First = styled.div`
  ${clearFix()};
  margin-bottom: 8px;
`;

const Sentence = styled.h2`
  font-weight: 600;
  letter-spacing: 1px;
  color: ${props => props.theme.color.p800};
  height: 30px;
  line-height: 30px;
  margin-left: -8px;
  padding-left: 8px;
  margin-right: 20px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #e3e3e3;
  }
`;

const Note = styled.h3`
  margin-top: 8px;
  font-weight: 400;
  line-height: 18px;
  font-size: 13px;
  letter-spacing: 0.4px;
  color: ${props => props.theme.color.p800};
`;

const Second = styled.div`
  ${clearFix()};
  margin-top: 16px;
`;

const ContainerTitle = styled.div`
  ${clearFix()};
  display: inline-block;
  vertical-align: middle;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 1px;
  margin: 0;
  height: 20px;
  line-height: 20px;
  line-height: 23px;
  margin-right: 4px;
`;
const Content = styled.div`
  ${clearFix()};
  display: inline-block;
  color: ${props => props.theme.color.p800};
  font-weight: 400;
  letter-spacing: 1px;
  margin: 0;
  height: 20px;
  text-decoration: underline;
  line-height: 20px;
`;

const Process = styled.div`
  ${clearFix()};
  display: inline-block;
  color: ${props => props.theme.color.p800};
  font-weight: 500;
  letter-spacing: 1px;
  margin: 0;
  height: 20px;
  line-height: 20px;
`;
