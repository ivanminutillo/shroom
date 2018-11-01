import React from "react";
import styled, { css } from "styled-components";
import { clearFix } from "polished";
import { Icons } from "oce-components";
import moment from "moment";
import Feed from "../../components/FeedItem";
import LogEvent from "../../components/logEvent/index";
import CommitmentStatus from "../../components/commitmentStatus";
import AddProvider, { DeleteProvider } from "../../components/addProvider";
import { compose, withState, withHandlers } from "recompose";
import OutsideClickHandler from "react-outside-click-handler";
import EditNote from "../modalIntent/editNote";
import EditSentence from "../modalIntent/editSentence";
import ButtonDeleteIntent from "../deleteIntent";
import EditDueDate from "../editDueDate";

export default compose(
  withState("popup", "isOpen", false),
  withState("addEvent", "onAddEvent", false),
  withState("isNoteOpen", "onNoteOpen", false),
  withState("isSentenceOpen", "onSentenceOpen", false),
  withHandlers({
    handlePopup: props => () => props.isOpen(!props.popup),
    handleAddEvent: props => () => props.onAddEvent(!props.addEvent),
    handleNoteOpen: props => () => {
      props.isOpen(false);
      props.onNoteOpen(!props.isNoteOpen);
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
    addEvent,
    toggleModal,
    handlePopup,
    handleNoteOpen,
    isNoteOpen,
    isSentenceOpen,
    handleSentenceOpen,
    popup,
    openValidationModal,
    scopeId,
    myId,
    client,
    providerImage
  }) => {
    let duration = moment.duration(moment(data.due).diff(moment())).asHours();
    return (
      <Intent>
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
                } of ${data.resourceClassifiedAs.name} in ${data.scope.name}`}
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
              <Infos>
                {data.inputOf ? (
                  <ProcessContainer>
                    <ContainerTitle>
                      <Icons.UpLeft width="13" height="13" color="#f0f0f0" />
                    </ContainerTitle>
                    <Content>#{data.inputOf.name}</Content>
                  </ProcessContainer>
                ) : null}
                {data.outputOf ? (
                  <ProcessContainer>
                    <ContainerTitle>
                      <Icons.UpRight width="13" height="13" color="#f0f0f0" />
                    </ContainerTitle>
                    <Content>#{data.outputOf.name}</Content>
                  </ProcessContainer>
                ) : null}
              </Infos>
              <EditDueDate due={data.due} intentId={data.id} />
              <Agents>
                <span style={{ verticalAlign: "middle", position: "relative" }}>
                  <span
                    style={{ verticalAlign: "middle" }}
                    onClick={handlePopup}
                  >
                    <Icons.More width="18" height="18" color="#f0f0f0" />
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

              {/* {data.provider ? (
            
              <Img style={{ backgroundImage: `url(${data.provider.image})` }} />
            </Agents>
          ) : null} */}
            </FirstInfo>
          </Second>
        </Wrapper>
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
              openValidationModal={openValidationModal}
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
        </Events>
        <Actions>
          {addEvent ? (
            <LogEvent
              commitmentId={data.id}
              providerId={myId}
              scopeId={scopeId}
              action={data.action}
              unit={data.committedQuantity.unit.name}
              unitId={data.committedQuantity.unit.id}
              resourceId={data.resourceClassifiedAs.id}
              resource={data.resourceClassifiedAs.name}
            />
          ) : (
            <div style={{ marginLeft: "8px" }}>
              <ImgProvider
                style={{ backgroundImage: `url(${providerImage})` }}
              />{" "}
              <Button onClick={handleAddEvent}>Log an event</Button>
            </div>
          )}
        </Actions>
      </Intent>
    );
  }
);

const B = styled.b`
  font-weight: 500;
  color: ${props => props.theme.color.p100};
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: #f0f0f0bd;
`;

const Actions = styled.div`
  padding-bottom: 8px;
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

const ImgProvider = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background-size: cover;
  background-color: #494f5c;
  vertical-align: middle;
`;

const Button = styled.button`
  height: 26px;
  cursor: pointer;
  margin-top: 8px;
  color: #f0f0f0e6;
  font-size: 13px;
  margin-right: 28px;
  border: none;
  letter-spacing: 0.5px;
  background: #484b54;
  border-radius: 34px;
`;

const Intent = styled.div`
  ${clearFix()};
  margin-top: 0;
  padding-bottom: 0px;
  background: #353841;
  margin-bottom: 8px;
`;
const Events = styled.div`
  ${clearFix()};
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
  border-bottom: 1px solid #22232680;
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
  background: ${props => props.theme.color.b100};
  display: inline-block;
  border-radius: 2px;
  padding: 0 6px;
  height: 24px;
`;
const ContainerTitle = styled.h3`
  ${clearFix()};
  display: inline-block;
  vertical-align: middle;
  line-height: 24px;
`;
const Content = styled.div`
  ${clearFix()};
  display: inline-block;
  color: #f0f0f0;
  font-size: 13px;
  margin-left: 4px;
  line-height: 24px;
`;

const Sentence = styled.h3`
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  font-size: 14px;
  text-transform: capitalize;
  ${props =>
    props.isFinished &&
    css`
      text-decoration: line-through;
      text-decoration-color: #ffffffa1;
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
  float: left;
  margin-rigth: 4px;
`;
const Date = styled.h3`
  float: left;
  color: #99adc6;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 1px;
  margin: 0;
  height: 24px;
  line-height: 24px;
  border-radius: 2px;
  margin-left: 4px;
  ${props =>
    props.deadline === "soon" &&
    css`
      color: #ffffff;
      background: #ffab00;
      padding: 0 5px;
    `} ${props =>
    props.deadline === "expired" &&
    css`
      color: #ffffff;
      background: #ff5630;
      padding: 0 5px;
    `};
`;
const Note = styled.h3`
  margin-top: 0px;
  font-weight: 400;
  line-height: 18px;
  font-size: 13px;
  letter-spacing: 0.4px;
  color: ${props => props.theme.color.p150};
  padding-left: 8px;
  border-left: 1px solid;
  margin-left: 4px;
`;
