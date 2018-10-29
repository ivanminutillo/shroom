import gql from "graphql-tag";

export default gql`
  mutation($token: String!, $id: Int! ) {
    deleteAgentResourceClassification(token: $token, id: $id) {
      agentResourceClassification {
        agent {
          name
        }
        resourceClassification {
          name
        }
        action
      }
    }
  }
`;
