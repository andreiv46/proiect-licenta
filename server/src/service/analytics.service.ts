import mongoose from "mongoose";
import {
    PersonalPaymentsOverview,
    ExpensePerMonth,
} from "../models/analytics.model";
import ExpenseHistoryModel from "../models/expense-history.model";

export async function getPersonalPaymentsOverview(
    userId: string
): Promise<PersonalPaymentsOverview> {
    const [result]: {
        lastSixMonths: ExpensePerMonth[];
        total: { total: number; count: number }[];
    }[] = await ExpenseHistoryModel.aggregate([
        {
            $match: { user: new mongoose.Types.ObjectId(userId) },
        },
        {
            $facet: {
                lastSixMonths: [
                    {
                        $group: {
                            _id: {
                                year: { $year: "$date" },
                                month: { $month: "$date" },
                            },
                            total: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $sort: { _id: -1 },
                    },
                    {
                        $limit: 6,
                    },
                    {
                        $project: {
                            _id: 0,
                            month: "$_id.month",
                            year: "$_id.year",
                            total: 1,
                            count: 1,
                        },
                    },
                ],
                total: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            total: 1,
                            count: 1,
                        },
                    },
                ],
            },
        },
    ]);
    return {
        lastSixMonths: result?.lastSixMonths || [],
        total: result?.total?.[0]?.total || 0,
        count: result?.total?.[0]?.count || 0,
    };
}
