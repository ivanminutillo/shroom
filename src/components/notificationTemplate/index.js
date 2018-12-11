import React from "react";
import styled, { css } from "styled-components";
import { clearFix, animation } from "polished";
import Icons from "../../atoms/icons.tsx";

const Wrapper = styled.div`
  background-color: #0052CC;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
  ${animation("slidein", "1s", "ease-in-out")}
  ${clearFix()};
  ${props =>
    props.type === "alert" &&
    css`
      background: #ff5630;
      color: white;
    `}
  ${props =>
    props.type === "warning" &&
    css`
      background: #ffab00;
      color: #091e42;
    `}
  ${props =>
    props.type === "success" &&
    css`
      background: #36b37e;
      color: #091e42;
    `}
`;

const Content = styled.div`
  width: 90%;
  display: inline-block;
  color: white;
  ${props =>
    props.type === "alert" &&
    css`
      color: white;
    `}
  ${props =>
    props.type === "warning" &&
    css`
      color: #091e42;
    `}
  ${props =>
    props.type === "success" &&
    css`
      color: #091e42;
    `}
`;

const Actions = styled.div`
  float: right;
  cursor: pointer;
  height: 18px;
`;

const Container = styled.div``;

const Notification = ({ notifications, dismiss }) => {
  return (
    <Container>
      {notifications.map((el, i) => (
        <Wrapper key={i} type={el.type}>
          <Content type={el.type}>{el.message}</Content>
          <Actions
            onClick={() =>
              dismiss({
                variables: {
                  id: el.id
                }
              })
            }
          >
            <Icons.Cross width="18" height="18" color={"#fff"} />
          </Actions>
        </Wrapper>
      ))}
    </Container>
  );
};

export default Notification;
