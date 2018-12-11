import * as React from 'react'
import Icons from '../../atoms/icons'
import Button from '../../atoms/button'
import styled from 'styled-components'

const Wrapper = styled.div`
    margin-top: 20px;
    text-align: center;
    & h1 {
        display: inline-block;
        margin-left: 10px;
        color: #606984;
        font-size: 16px;
        vertical-align: middle;
    }
`
const LoaderIcon = styled.span`
    vertical-align: sub;
`

const WrapperError = styled.div`
font-size: 26px;
color: #f0f0f0a3;
line-height: 30px;
font-weight: 500;
`


export const LoadingMini = () => {
  console.log(Icons.Loading)
    return (
    <Wrapper>
      <div>
        <LoaderIcon><Icons.Loading width="24" height="24" color='#606984' /></LoaderIcon>
        <h1>Loading...</h1>
      </div>
    </Wrapper>
)}


export const ErrorMini = ({message, loading, refetch}) => (
    <WrapperError>
        <div><Icons.Cross width='26' height='26' color='#f0f0f0a3' /></div>
        <h1>{message}</h1>
        {loading ? <Button disabled>Wait...</Button> : <Button onClick={() => refetch()}>Refresh</Button>}
    </WrapperError>
)

