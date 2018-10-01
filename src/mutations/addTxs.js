import gql from "graphql-tag";

const AddTxs = gql`
  mutation addTxs(
      $id: String, 
      $amount: String, 
      $from: String, 
      $to: String, 
      $date: String, 
    ){
    addTxsList(
        id: $id, 
        amount: $amount, 
        from: $from, 
        to: $to, 
        date: $date
    ) @client {
        id
        amount
        currency
        from-id
        to-id
        tags {
          name
        }
        timestamp
      }
  }
`;


export default AddTxs