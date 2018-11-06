
  import {getRerourcesByAction} from "../queries/getResources";

  export const getResourcesByAction = (client, action, val) => {
    return client
      .query({
        query: getRerourcesByAction,
        variables: { 
            token: localStorage.getItem("oce_token"),
            action: action.toUpperCase()
        }
      })
      .then(res => {
        let options = res.data.viewer.resourceClassificationsByAction.map(
          resource => ({
            value: resource.id,
            label: resource.name
          })
        );
        let newOpt = options.filter(i =>
          i.label.toLowerCase().includes(val.toLowerCase())
        );
        return newOpt;
      });
  };