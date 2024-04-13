import { sharedExpenseJob } from "./shared-expense.jobs";

export const configurescheduledJobs = () => {
    sharedExpenseJob().invoke();
};
