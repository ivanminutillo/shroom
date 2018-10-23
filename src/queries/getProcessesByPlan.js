import gql from 'graphql-tag'

const Plan = gql`
query ($token: String, $id: Int) {
    viewer(token: $token) {
      plan(id: $id) {
        id
        planProcesses {
          id
          name
        }
      }
    }
  } 
`
export default Plan
