import gql from 'graphql-tag'

const relationshipQuery = gql`
query ($token: String, $id: Int) {
    viewer(token: $token) {
      agent (id: $id) {
        id
        agentRelationships {
          relationship {
            label
            category
          }
          object {
            id
            name
            note
            image
          }
          subject {
            name
            image
            id
          }
        }
      }
    }
  }
`

export default relationshipQuery
