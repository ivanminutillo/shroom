import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import moment from "moment";
import { withRouter } from "react-router-dom";

const List = styled.div`
  height: 100px;
  margin-bottom: 10px;
  position: relative;
  background: #fbfbfb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
`;

const Title = styled.h3`
  font-weight: 700;
  margin: 10px;
  color: #100f2b;
  overflow: hidden;
`;
const Scope = styled.h3`
  margin: 0;
  padding: 0;
  margin-left: 10px;
  margin-right: 10px;
  font-weight: 300;
  text-transform: lowercase;
  overflow: hidden;
`;
const Info = styled.h3`
position: absolute;
bottom: 0;
left: 0;
right: 0;
height: 30px;
padding: 0 10px;
border-radius: 0 0 3px 3px;
background: white;
box-shadow: 0 -2px -2px rgba(0, 0, 0, .2)
`;
const Date = styled.h3`
  font-size: 13px;
  font-weight: 400;
  color: rgb(109, 109, 109);
  letter-spacing: 0px;
  line-height: 30px;
`;

const Cards = ({ data, link }) => {
  let newData = data.map(x => ({ ...x, date: moment(x.plannedOn).unix() }));
  return (
    <div>
      {newData.sort((a, b) => b.date - a.date).map((org, i) => (
        <List key={i}>
          <Link key={"plan_" + i} to={link + "/" + org.id}>
            <Title>{org.name.length > 0 ? org.name : org.planProcesses[0].name}</Title>
            <Scope>{org.note}</Scope>
            <Info>
              <Date>
                Due {moment(org.due).format("DD MMM YYYY")}
              </Date>
            </Info>
          </Link>
        </List>
      ))}
    </div>
  );
};

export default withRouter(Cards);
