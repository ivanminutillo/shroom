import gql from 'graphql-tag'
import { event } from "../fragments/economicEvents";

const GetCommitment = gql`
query ($token: String, $id: Int!) {
    viewer(token: $token) {
      commitment(id: $id) {
        id
        isFinished
        isDeletable
        fulfilledBy {
          fulfilledBy {
            ...BasicEvent
          }
        }
        plan {
          note
          name
          id
        }        
        provider {
          id
          name
          image
        }
        inputOf {
          id
          name
        }
        outputOf {
          id
          name
        }
        note
        action
        committedQuantity {
          numericValue
          unit {
            name
            id
          }
        }
        due
        resourceClassifiedAs {
          name
          id
        }
      }
    }
  }
  ${event}
  `

export default GetCommitment
