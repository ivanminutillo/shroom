import gql from "graphql-tag";

const getResourcesQuery = gql`
query ($token: String) {
  viewer(token: $token) {
    allResourceClassifications {
      name
      category
      processCategory
      id
    }
  }
}`;

export default getResourcesQuery;
