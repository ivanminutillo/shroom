import styled from "styled-components";
import { clearFix, placeholder } from "polished";
import media from "styled-media-query";

const Module = styled.div`
  ${clearFix()};
  position: relative;
  border-radius: 4px;
  z-index: 1;
  ${media.lessThan("medium")`
    width: 100%;
    left: 0;
    margin: 0;
  `}
`;

const Log = styled.div`
  margin-top: 0px;
  padding: 0 10px;
  & input {
    width: 70px;
    float: left;
    ${placeholder({ color: "#f0f0f0" })};
    font-size: 18px;
  }
  ${clearFix()};

  
`;
// TO DELETE!!!!
const Header = styled.div`
  margin-top: 0px;
  padding: 0 4px;
  height: 40px;
  ${clearFix()};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: #0B6DB5;
  ${media.lessThan("medium")`
  padding-left: 4px;
  `}
`;

const Title = styled.h3`
  float: left;
  color: ${props => props.theme.color.p200};
  height: 40px;
  line-height: 40px;
`


const SentenceAction = styled.h3`
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p300};
  font-weight: 500;
  font-style: italic;
  float: left;
  line-height: 40px;
  margin-right: 10px;
  max-width: 210px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: capitalize;
`;
const Of = styled.span`
  font-size: ${props => props.theme.fontSize.h2};
  color: ${props => props.theme.color.p800};
  font-weight: 300;
  font-style: italic;
  line-height: 40px;
  float: left;
  width: 20px;
  margin-right: 8px;
`;

const Note = styled.div`
padding: 0 10px;
margin-bottom: 8px;
  & textarea {
    outline: none;
    display: block;
    min-height: 30px;
    resize: none;
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    clear: both;
    font-weight: 400;
    overflow: hidden;
    word-wrap: break-word;
    color: #333;
    border: none;
    border-top: 1px solid #dedede36;
    margin: 0;
    padding: 8px 16px;
    ${placeholder({ color: "#333" })};
  }
`

const PublishActions = styled.div`
    height: 36px;
    background: #393f50;
    ${clearFix}

    & button {
        float: right;
        width: 120px;
        margin: 0;
        box-shadow: none;
        border: 0;
        border-radius: 0;
        margin-left: 8px;
    }
`

const ItemDate = styled.div`
width: auto;
margin-right: 0 !important;
margin-left: 10px;
float: left;
height: 36px;
& span {
    display: inline-block;
    /* margin-top: 5px; */
    line-height: 36px;
    height: 36px;
    vertical-align: sub;
}

& > div  {
    height: 30px !important;
    display: inline-block;
}

& input {
    border: none;
    font-size: 14px;
    padding: 0;
    height: 36px;
    width: 70px;
    font-weight: 500;
    background: transparent;
    margin: 0;
    margin-left: 10px;
    color: #2587cf;
}
`

const ItemDistribution = styled.div`
    margin-right: 10px;
    margin-top: 7px;
    float: right;
    & label {
        color: #828282;
  font-weight: 500;
  letter-spacing: 1px;
  margin-left: 10px;
  font-size: 13px;
    }
`

const Span = styled.span`
  float: left;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  margin-right: 10px;
`

export default { Module, Header, Title, ItemDate, Span, ItemDistribution, Log,PublishActions, Note, SentenceAction, Of };
