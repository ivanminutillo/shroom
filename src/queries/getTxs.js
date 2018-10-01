import gql from "graphql-tag";

export default gql`
  query {
    txs @client {
      id
      action
      start
      receiver {
        id
      }
      affectedQuantity {
        numericValue
        unit {
          name
        }
      }
      note
      affects {
        resourceClassifiedAs {
          name
          id
        }
      }
      provider {
        id
      }
    }
  }
`;
