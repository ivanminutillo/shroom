import styled, {css} from 'styled-components'

const Button = styled.button`
  background: #2588d0;
  border: 10px none;
  border-radius: 4px;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  letter-spacing: 0;
  line-height: 36px;
  overflow: hidden;
  padding: 0 16px;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: all .1s ease-in;
  white-space: nowrap;
  width: auto;
  &:disabled {
    background: #dadada;
    color: #a9a9a9;
    cursor: no-drop;
  }
${props => props.primary && css`
  background: #FF5630;
  color: white
`}
${props => props.gray && css`
  background: #e2e4e6;
  box-shadow: 0 1px 0 0 #c4c9cc;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  margin-top: 8px;
  max-width: 300px;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  text-overflow: ellipsis;
  user-select: none;
  white-space: nowrap;
  color: #4c4c4c;
  padding: 0;
  line-height: 38px;
  text-transform: none;
  background: #e2e4e6;
  box-shadow: 0 1px 0 0 #c4c9cc;
  text-align: left;
  padding: 0 10px;
`}
${props => props.small && css`
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  text-transform: capitalize;
`}
`
export default Button
