import gql from 'graphql-tag'

const Plan = gql`
query ($token: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        agentProcesses {
          id
          name
        }
      }
    }
  } 
`
export default Plan
