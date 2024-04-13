export interface ExpensePerMonth {
    year: number;
    month: number;
    total: number;
    count: number;
}

export interface PersonalPaymentsOverview {
    lastSixMonths: ExpensePerMonth[];
    total: number;
    count: number;
}

export interface SharedPaymentsOverview {
    lastSixMonths: ExpensePerMonth[];
    total: number;
    count: number;
}
