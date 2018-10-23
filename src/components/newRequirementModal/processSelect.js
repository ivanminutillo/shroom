import React from "react";
import getProcessesByPlan from "../../queries/getProcessesByPlan";
import { LoadingMini, ErrorMini } from "../loading";
import { Query } from "react-apollo";
import Select from "react-select";

export default ({ planId, setFieldValue, field }) => {
  return (
    <Query
      query={getProcessesByPlan}
      variables={{
        token: localStorage.getItem("oce_token"),
        id: planId
      }}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <LoadingMini />;
        if (error)
          return (
            <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
          );
        return (
          <Select
            onChange={val =>
              setFieldValue("process", { value: val.value, label: val.label })
            }
            value={field.value}
            options={data.viewer.plan.planProcesses.map(process => ({
              value: process.id,
              label: process.name
            }))}
            placeholder={"Select a process..."}
          />
        );
      }}
    </Query>
  );
};
