import { use } from "react";
import { RecurrenceSelectContext } from "../recurrence-select-context";

export const Test = () => {
  const { rruleOptions } = use(RecurrenceSelectContext);
  return <div>{JSON.stringify(rruleOptions)}</div>;
};
