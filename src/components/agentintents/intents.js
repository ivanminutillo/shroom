import React from "react";
import styled, { css } from "styled-components";
import { clearFix } from "polished";
import Icons from '../../atoms/icons.tsx'
import moment from "moment";
import Feed from "../../components/FeedItem/index.tsx";
import LogEvent from "../../components/logEvent/index";
import CommitmentStatus from "../../components/commitmentStatus";
import AddProvider, { DeleteProvider } from "../../components/addProvider";
import { compose, withState, withHandlers } from "recompose";
import OutsideClickHandler from "react-outside-click-handler";
import EditNote from "../modalIntent/editNote";
import EditSentence from "../modalIntent/editSentence";
import ButtonDeleteIntent from "../deleteIntent";
import EditDueDate from "../editDueDate";
import { NavLink } from "react-router-dom";
import Process from '../../atoms/shooting_star.png'
import Pencil from '../../atoms/pencil.png'

export default compose(
  withState("popup", "isOpen", false),
  withState("addEvent", "onAddEvent", false),
  withState("isNoteOpen", "onNoteOpen", false),
  withState("isFeedOpen", "onFeedOpen", false),
  withState("isSentenceOpen", "onSentenceOpen", false),
  withHandlers({
    handlePopup: props => () => props.isOpen(!props.popup),
    handleAddEvent: props => () => props.onAddEvent(!props.addEvent),
    handleNoteOpen: props => () => {
      props.isOpen(false);
      props.onNoteOpen(!props.isNoteOpen);
    },
    handleFeedOpen: props => () => {
      props.onFeedOpen(!props.isFeedOpen);
    },
    handleSentenceOpen: props => () => {
      props.isOpen(false);
      props.onSentenceOpen(!props.isSentenceOpen);
    }
  })
)(
  ({
    data,
    handleAddEvent,
    handlePopup,
    handleNoteOpen,
    isNoteOpen,
    isSentenceOpen,
    handleSentenceOpen,
    popup,
    handleFeedOpen,
    isFeedOpen,
    toggleValidationModal,
    scopeId,
    myId,
    client,
  }) => {
    return (
      <Intent isFinished={data.isFinished}>
        <Infos>
          {data.inputOf ? (
            <ProcessContainer>
              <NavLink to={`/process/${data.inputOf.id}`}>
                <ContainerTitle style={{backgroundImage: `url(${Process})`}} />
                <Content>{data.inputOf.name}</Content>
              </NavLink>
            </ProcessContainer>
          ) : null}
          {data.outputOf ? (
            <ProcessContainer>
              <NavLink to={`/process/${data.outputOf.id}`}>
              <ContainerTitle style={{backgroundImage: `url(${Process})`}} />
                <Content>{data.outputOf.name}</Content>
              </NavLink>
            </ProcessContainer>
          ) : null}
        </Infos>
        <Wrapper>
          <First>
            {isSentenceOpen ? (
              <EditSentence
                client={client}
                handleSentenceOpen={handleSentenceOpen}
                intent={data}
              />
            ) : (
              <Sentence isFinished={data.isFinished}>
                <CommitmentStatus
                  intentId={data.id}
                  isFinished={data.isFinished}
                />
                {data.provider ? (
                  <Img
                    style={{ backgroundImage: `url(${data.provider.image})` }}
                  />
                ) : null}
                {!data.provider ? (
                  <AddProvider providerId={myId} intentId={data.id} />
                ) : data.provider && data.provider.id === myId ? (
                  <DeleteProvider intentId={data.id} />
                ) : null}
                {`${data.action} ${data.committedQuantity.numericValue} ${
                  data.committedQuantity.unit.name
                } of ${data.resourceClassifiedAs.name} in ${
                  data.scope ? data.scope.name : null
                }`}
              </Sentence>
            )}
            <Note>
              {isNoteOpen ? (
                <EditNote intent={data} handleNoteOpen={handleNoteOpen} />
              ) : (
                data.note
              )}
            </Note>
          </First>
          <Second>
            <FirstInfo>
              <EditDueDate due={data.due} intentId={data.id} />
              <Agents>
                <span style={{ verticalAlign: "middle", position: "relative" }}>
                  <span
                    style={{ verticalAlign: "middle" }}
                    onClick={handlePopup}
                  >
                    <Icons.More width="18" height="18" color="#33340" />
                  </span>
                  {popup ? (
                    <OutsideClickHandler onOutsideClick={handlePopup}>
                      <Popup>
                        <PopupItem onClick={handleSentenceOpen}>
                          Edit sentence
                        </PopupItem>
                        <PopupItem onClick={handleNoteOpen}>
                          Edit note
                        </PopupItem>
                        {data.isDeletable ? (
                          <PopupItem>
                            <ButtonDeleteIntent
                              intentId={data.id}
                              scopeId={scopeId}
                            />
                          </PopupItem>
                        ) : null}
                      </Popup>
                    </OutsideClickHandler>
                  ) : null}
                </span>
              </Agents>
            </FirstInfo>
          </Second>
        </Wrapper>
        {isFeedOpen ? (
          <Events>
            {data.fulfilledBy.map((ev, i) => (
              <Feed
                scopeId={scopeId}
                image={ev.fulfilledBy.provider.image}
                commitmentId={data.id}
                key={i}
                id={ev.fulfilledBy.id}
                loggedUserId={myId}
                providerId={ev.fulfilledBy.provider.id}
                withValidation
                withDelete
                validations={ev.fulfilledBy.validations}
                openValidationModal={toggleValidationModal}
                primary={
                  <FeedItem>
                    <B>{ev.fulfilledBy.provider.name}</B>{" "}
                    {ev.fulfilledBy.action +
                      " " +
                      ev.fulfilledBy.affectedQuantity.numericValue +
                      " " +
                      ev.fulfilledBy.affectedQuantity.unit.name +
                      " of "}
                    <i>{ev.fulfilledBy.affects.resourceClassifiedAs.name}</i>
                  </FeedItem>
                }
                secondary={ev.fulfilledBy.note}
                date={moment(ev.fulfilledBy.start).format("DD MMM")}
              />
            ))}
            <WrapperLogEvent>
              <LogEvent
                commitmentId={data.id}
                providerId={myId}
                scopeId={scopeId}
                action={data.action}
                unit={data.committedQuantity.unit.name}
                unitId={data.committedQuantity.unit.id}
                resourceId={data.resourceClassifiedAs.id}
                resource={data.resourceClassifiedAs.name}
                closeLogEvent={handleAddEvent}
              />
            </WrapperLogEvent>
            <CloseFeed onClick={handleFeedOpen}>
              <Icons.Arrowup width="18" height="18" color="#fff" />
            </CloseFeed>
          </Events>
        ) : (
          <Actions>
            <ActionSpan onClick={handleFeedOpen}>
                <SpanIcon style={{backgroundImage: `url(${Pencil})`}}/>
              ({data.fulfilledBy.length})
            </ActionSpan>
          </Actions>
        )}
      </Intent>
    );
  }
);

const B = styled.b`
  font-weight: 500;
  color: #32211B;
`;
const ActionSpan = styled.div`
  font-weight: 500;
  color: #282b30;
  font-size: 13px;
  padding-left: 8px;
  padding-bottom: 8px;
  color: #282b3082;
  margin-top: 10px;
  display: inline-block;
  cursor: pointer;
`;
const SpanIcon = styled.div`
  cursor: pointer;
  margin-right: 8px;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: contain;
  vertical-align: sub;
`;

const WrapperLogEvent = styled.div`
  padding: 10px 0;
  border-top: 1px solid #e9e9e9;
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p900};
`;

const Actions = styled.div`
  padding-bottom: 0px;
`;

const CloseFeed = styled.div`
  position: absolute;
  border-radius: 100px;
  background: #114357; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    #114357,
    #f29492
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(#114357, #f29492);
  text-align: center;
  padding-top: 11px;
  box-shadow: 0 4px 20px 0px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  right: 50%;
  bottom: -12px;
  width: 40px;
  height: 40px;
  margin-right: -20px;
`;

const Popup = styled.div`
  position: absolute;
  width: 200px;
  left: 50px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  margin-left: -200px;
  background: #f0f0f0;
  border-radius: 0px;
  top: -30px;
  z-index: 99999999999999999;
`;
const PopupItem = styled.div`
  border-bottom: 1px solid #d0d0d0;
  height: 30px;
  font-size: 13px;
  padding: 0 8px;
  line-height: 30px;
  &:last-of-type  {
    border-bottom: none;
  }
  &:hover {
    background: ${props => props.theme.color.b100};
    color: ${props => props.theme.color.p100};
  }
  color: #4c4d4d;
`;

const Intent = styled.div`
  ${clearFix()};
  margin-top: 0;
  padding-bottom: 0px;
  border: 1px solid #97979740;
  margin: 8px;
  border-radius: 2px;
  background: #fff;
`;
const Events = styled.div`
  ${clearFix()};
  position: relative;
`;
const Agents = styled.div`
  ${clearFix()};
  float: right;
  margin-left: 4px;
`;
const Img = styled.div`
  width: 24px;
  height: 24px;
  background: ${props => props.theme.color.p150};
  border-radius: 100px;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
  background-size: cover;
`;

const Wrapper = styled.div`
  padding: 8px;
  position: relative;
  cursor: pointer;
`;

const First = styled.div`
  ${clearFix()};
`;

const Second = styled.div`
  ${clearFix()};
  position: absolute;
  right: 8px;
  top: 8px;
`;

const FirstInfo = styled.div`
  ${clearFix()};
`;

const ProcessContainer = styled.div`
  ${clearFix()};
  padding: 0 8px;
`;
const ContainerTitle = styled.h3`
  ${clearFix()};
  display: inline-block;
  vertical-align: middle;
  line-height: 30px;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  background-size: contain;
  vertical-align: middle;
`;
const Content = styled.div`
  ${clearFix()};
  display: inline-block;
  color: ${props => props.theme.color.b100};
  font-size: 13px;
  margin-left: 4px;
  line-height: 26px;
  margin-top: 4px;
  font-weight: 500;
  display: inline-block;
  color: #bcbec0;
  font-size: 12px;
  margin-left: 4px;
  line-height: 26px;
  margin-top: 4px;
  letter-spacing: .5px;
  text-transform: uppercase;
`;

const Sentence = styled.h3`
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.5px;
  font-size: 14px;
  text-transform: capitalize;
  color: #32211B;
  ${props =>
    props.isFinished &&
    css`
      text-decoration: line-through;
    `};

  & input {
    vertical-align: text-bottom;
    margin-right: 8px;
    margin-top: 0px;
  }
`;
const Infos = styled.div`
  font-weight: 400;
  line-height: 20px;
`;

const Note = styled.h3`
  margin-top: 5px;
  font-weight: 400;
  line-height: 18px;
  font-size: 13px;
  letter-spacing: 0.4px;
  color: ${props => props.theme.color.p800};
  padding-left: 8px;
  border-left: 1px solid;
  margin-left: 4px;
`;
