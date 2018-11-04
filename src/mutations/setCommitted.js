import gql from 'graphql-tag'

export default gql`
  mutation setCommitted($total: String!){
      setCommitted(total: $total) @client
  }
`