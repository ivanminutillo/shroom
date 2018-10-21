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
        <Primary>{primary}</Primary>
        <Secondary light={light}>{secondary}</Secondary>
      </Desc>
      <Date>{date}</Date>

      {withValidation || withDelete ? (
        <Actions>
          {withDelete && providerId === loggedUserId ? (
            <DeleteEvent commitmentId={commitmentId} eventId={id} scopeId={scopeId} />
          ) : null}
          {withValidation && providerId !== loggedUserId ? (
            <span>
              <Action onClick={() => openValidationModal(id)}>
                <Span>
                  <Icons.Star width="16" color="#99ADC6" />
                </Span>
                <ActionTitle>Validate</ActionTitle>
              </Action>
              <Validations>
                {validations.map((a, i) => (
                  <Icons.Check key={i} with="20" height="20" color="green" />
                ))}
              </Validations>
            </span>
          ) : null}
        </Actions>
      ) : null}
    </FeedItem>
  );
}

const FeedItem = styled.div`
  border-bottom: 1px solid #e2e4e61a;
  min-height: 30px;
  position: relative;
  margin: 0;
  margin-left: -8px;
  margin-right: -8px;
  padding-left: 8px;
  padding-right: 8px;
  padding: 8px;
  word-wrap: break-word;
  font-size: 14px;
  color: #f0f0f0bd;
  ${clearFix()};
  transition: background 0.5s ease;
  &:hover {
    background: #f9f1e320;
  }
`;

const Primary = styled.div`
  margin-right: 50px;
  line-height: 20px;
`;

const Secondary = styled.div`
  font-weight: 400;
  margin-top: 4px;
  letter-spacing. .5px;
  line-height: 20px;
  font-size: 14px;
  color: ${props => props.light ? props.theme.color.p800 : props.theme.color.p150};
`;

const Member = styled.div`
  float: left;
  vertical-align: sub;
`;
const Validations = styled.div`
  float: right;
  vertical-align: sub;
`;

const MemberItem = styled.span`
  background-color: #d6dadc;
  border-radius: 3px;
  color: #4d4d4d;
  display: block;
  float: left;
  height: 30px;
  margin: 0 4px 4px 0;
  overflow: hidden;
  position: relative;
  width: 30px;
  user-select: none;
  z-index: 0;
`;

const Desc = styled.div`
  margin-left: 40px;
  position: relative;
  min-height: 30px;
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
  float: right;
  position: absolute;
  right: 10px;
  top: 10px;
  color: #99adc6;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 1px;
  margin: 0;
  height: 20px;
  line-height: 20px;
  border-radius: 3px;
`;

const Actions = styled.div`
  ${clearFix()};
  margin-top: 8px;
  margin-left: 36px;
`;

const ActionTitle = styled.h3`
  margin-left: 4px;
  font-weight: 500;
  margin-left: 8px;
  float: left;
  display: inline-block;
  height: 20px;
  line-height: 32px;
  font-size: 12px;
  letter-spacing: 1px;
  color: ${props => props.theme.color.p300};
`;

const Action = styled.div`
  cursor: pointer;
  float: left;
  margin-right: 8px;
  transition: background-color 0.5s ease;
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
