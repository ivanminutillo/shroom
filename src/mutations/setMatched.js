import gql from 'graphql-tag'

export default gql`
  mutation setMatched($total: String!){
      setMatched(total: $total) @client
  }
`