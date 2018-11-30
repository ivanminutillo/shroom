import gql from "graphql-tag";

export default gql`
  query($token: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        agentDefinedResourceClassifications {
          name
          category
          processCategory
          id
          unit {
            id
            name
          }
        }
      }
    }
  }
`;

export const getResourcesByContextByAction = gql`
  query($token: String, $action: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        agentDefinedResourceClassifications(action: $action) {
          name
          category
          processCategory
          id
          unit {
            id
            name
          }
        }
      }
    }
  }
`;
