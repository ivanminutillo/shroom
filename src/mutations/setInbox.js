import gql from 'graphql-tag'

export default gql`
  mutation setInbox($total: String!){
      setInbox(total: $total) @client
  }
`