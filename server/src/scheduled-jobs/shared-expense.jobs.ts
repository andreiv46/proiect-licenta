import { Job, scheduleJob } from "node-schedule";
import {
    SharedExpenseModel,
    SharedExpenseHistory,
    SharedExpenseHistoryModel,
    UserSharedExpenseHistory,
    UserSharedExpenseHistoryModel,
} from "../models/shared-expense.model";

export const sharedExpenseJob = (): Job => {
    return scheduleJob("0 0 0 * * *", async () => {
        console.log("Shared expense job running");
        const sharedExpenses = await SharedExpenseModel.find({
            nextPaymentDate: {
                $lte: new Date(),
            },
        });

        const sharedExpenseHistories: SharedExpenseHistory[] = [];

        for (const sharedExpense of sharedExpenses) {
            const sharedExpenseHistory: SharedExpenseHistory = {
                owner: sharedExpense.owner,
                ownerAmount: sharedExpense.ownerAmount,
                totalAmount: sharedExpense.totalAmount,
                name: sharedExpense.name,
                paymentInfo: sharedExpense.paymentInfo,
                description: sharedExpense.description,
                recipient: sharedExpense.recipient,
                friends: sharedExpense.friends.map((friend) => {
                    return {
                        user: friend.user,
                        amount: friend.amount,
                        sharePaid: friend.sharePaid,
                    };
                }),
            };
            sharedExpenseHistories.push(sharedExpenseHistory);
            const nextPaymentDate = sharedExpense.calculateNextPaymentDate();
            await SharedExpenseModel.findByIdAndUpdate(sharedExpense._id, {
                nextPaymentDate: nextPaymentDate,
            });
        }

        const userSharedExpenseHistories: UserSharedExpenseHistory[] = [];
        const sharedExpenseHistoriesInserted =
            await SharedExpenseHistoryModel.insertMany(sharedExpenseHistories);

        for (const sharedExpenseHistoryInserted of sharedExpenseHistoriesInserted) {
            const ownerUserSharedExpenseHistory: UserSharedExpenseHistory = {
                user: sharedExpenseHistoryInserted.owner,
                sharedExpense: sharedExpenseHistoryInserted._id,
                isOwner: true,
            };
            userSharedExpenseHistories.push(ownerUserSharedExpenseHistory);

            for (const friend of sharedExpenseHistoryInserted.friends) {
                userSharedExpenseHistories.push({
                    user: friend.user,
                    sharedExpense: sharedExpenseHistoryInserted._id,
                    isOwner: false,
                });
            }
        }

        await UserSharedExpenseHistoryModel.insertMany(
            userSharedExpenseHistories
        );

        console.log(sharedExpenseHistoriesInserted);
    });
};
