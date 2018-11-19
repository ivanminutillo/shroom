import React from "react";
import styled from "styled-components";
import { Icons } from "oce-components";
import { clearFix } from "polished";
import DeleteEvent from "../deleteEvent";

export default function({
  image,
  id,
  primary,
  light,
  commitmentId,
  validations,
  openValidationModal,
  secondary,
  date,
  scopeId,
  withValidation,
  withDelete,
  providerId,
  loggedUserId
}) {
  return (
    <FeedItem>
      <Member>
        <MemberItem>
          <Img alt="provider" src={image} />
        </MemberItem>
      </Member>
      <Desc>
        <Primary>
          {primary}
          <Secondary light={light}>{secondary}</Secondary>
        </Primary>
        <Validations>
          {validations.map((a, i) => (
            <Icons.Check key={i} with="20" height="20" color="green" />
          ))}
        </Validations>
        <Sub>
        {withValidation || withDelete ? (
        <Actions>
          {withDelete && providerId === loggedUserId ? (
            <DeleteEvent
              commitmentId={commitmentId}
              eventId={id}
              scopeId={scopeId}
            />
          ) : null}
        {withValidation && providerId !== loggedUserId ? (
            <span>
              <Action onClick={() => openValidationModal(id)}>
                <Span>
                  <Icons.Star width="14" color="#989ba0" />
                </Span>
                <ActionTitle>Validate</ActionTitle>
              </Action>
            </span>
          ) : null}
        </Actions>
      ) : null}
        <Date>{date}</Date>
        </Sub>
      </Desc>
    </FeedItem>
  );
}

const FeedItem = styled.div`
  min-height: 30px;
  position: relative;
  margin: 0;
  padding: 8px;
  word-wrap: break-word;
  font-size: 14px;
  border-bottom: 1px solid #e9e9e9;
  padding-top: 16px;
  color: ${props => props.theme.color.p800};
  ${clearFix()};
  transition: background 0.5s ease;
`;

const Primary = styled.div`
  line-height: 20px;
  display: inline-block;
  padding: 0;
  background: #f0f8ff0f;
  border-radius: 56px;
  position: relative;
`;

const Secondary = styled.div`
  font-weight: 400;
  margin-top: 4px;
  letter-spacing. .5px;
  line-height: 20px;
  font-size: 14px;
  color: #36393fb0;
`;

const Member = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-right: 14px;
`;
const Validations = styled.div`
  float: right;
  margin-top: 5px;
  vertical-align: sub;
  margin-left: 5px;
`;

const Sub = styled.div`
  ${clearFix()};
  
`;

const MemberItem = styled.span`
  background-color: #d6dadc;
  border-radius: 100px;
  color: #4d4d4d;
  display: inline-block;
  float: left;
  height: 24px;
  overflow: hidden;
  position: relative;
  width: 24px;
  user-select: none;
  z-index: 0;
`;

const Desc = styled.div`
  position: relative;
  min-height: 30px;
  display: inline-block;
`;

const Img = styled.img`
  width: 32px;
  height: 32px;
  display: block;
  -webkit-appearance: none;
  line-height: 32px;
  text-indent: 4px;
  font-size: 13px;
  overflow: hidden;
  max-width: 32px;
  max-height: 32px;
  text-overflow: ellipsis;
`;

const Date = styled.div`
  font-weight: 400;
  color: ${props => props.theme.color.p200};
  font-weight: 400;
  font-size: 12px;
  line-height: 32px;
  height: 20px;
  letter-spacing: 1px;
  margin: 0;
  float: left;
`;

const Actions = styled.div`
  ${clearFix()};
  float: left;
  vertical-align: middle;
  margin-left: 0px;
  
`;

const ActionTitle = styled.h3`
  font-weight: 400;
  margin-left: 8px;
  display: inline-block;
  height: 20px;
  line-height: 32px;
  font-size: 12px;
  letter-spacing: 1px;
  color: ${props => props.theme.color.p200};
`;

const Action = styled.div`
  cursor: pointer;
  float: left;
  transition: background-color 0.5s ease;
  padding-right: 8px;
  margin-right: 24px;
  position: relative;
`;

const Span = styled.span`
  vertical-align: sub;
  margin-right: ${props => (props.withText ? "8px" : 0)}
  float: left;
  height: 30px;
  line-height: 30px;
  & svg {
    height: 30px;
  }
`;
