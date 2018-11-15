import React from "react";
import getProcessesByAgent from "../../queries/getProcessesByAgent";
import { LoadingMini, ErrorMini } from "../loading";
import { Query } from "react-apollo";
import Select from "react-select";

export default ({ scopeId, setFieldValue, field }) => {
  return (
    <Query
      query={getProcessesByAgent}
      variables={{
        token: localStorage.getItem("oce_token"),
        id: scopeId
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
            options={data.viewer.agent.agentProcesses.map(process => ({
              value: process.id,
              label: process.name
            }))}
            placeholder={"Is it part of a process ?"}
          />
        );
      }}
    </Query>
  );
};
