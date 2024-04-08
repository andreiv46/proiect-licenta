import {
    SharedExpenseModel,
    SharedExpenseDocument,
    UserSharedExpenseModel,
    SharedExpenseInvitationModel,
    // UserSharedExpenseDocument,
} from "../models/shared-expense.model";
import { CreateSharedExpenseInput } from "../schema/shared-expense.schema";
import {
    SharedExpenseNotCreatedError,
    SharedExpensesInvitesNotFoundError,
    SharedExpensesNotFoundError,
} from "../errors/shared-expense.errors";

export async function createSharedExpense(
    input: CreateSharedExpenseInput["body"],
    userId: string
): Promise<SharedExpenseDocument> {
    const sharedExpense = await SharedExpenseModel.create({
        ...input,
        nextPaymentDate: input.startDate,
        owner: userId,
        friends: [],
    });
    if (!sharedExpense) {
        throw new SharedExpenseNotCreatedError();
    }
    return sharedExpense;
}

export async function createUsershareExpense(
    userId: string,
    sharedExpense: SharedExpenseDocument
): Promise<void> {
    await UserSharedExpenseModel.create({
        user: userId,
        sharedExpense: sharedExpense.id,
        isOwner: true,
        notify: true,
    });
}

export async function createSharedExpenseInvitations(
    userId: string,
    sharedExpense: SharedExpenseDocument,
    friends: CreateSharedExpenseInput["body"]["friends"]
): Promise<void> {
    const invitations = friends.map((friend) => {
        return {
            sharedExpense: sharedExpense.id,
            user: friend.user,
            invitedBy: userId,
            amount: friend.amount,
            status: "pending",
        };
    });
    await SharedExpenseInvitationModel.insertMany(invitations);
}

export async function getSharedExpenseInvites(userId: string) {
    const invites = await SharedExpenseInvitationModel.find({
        user: userId,
        status: "pending",
    }).populate("sharedExpense");
    if (!invites) {
        throw new SharedExpensesInvitesNotFoundError();
    }
    return invites;
}

export async function getSharedExpenses(userId: string) {
    const sharedExpenses = await UserSharedExpenseModel.find({
        user: userId,
    }).populate({
        path: "sharedExpense",
        populate: [
            { path: "owner", select: "username" },
            { path: "friends.user", select: "username" },
        ],
    });
    if (!sharedExpenses) {
        throw new SharedExpensesNotFoundError();
    }
    return sharedExpenses;
}
