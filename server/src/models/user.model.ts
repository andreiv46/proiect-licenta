import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserInput {
    username: string;
    email: string;
    password: string;
}

export type UserWithoutPassword = Omit<UserInput, "password">;

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    comparePassword(userPassword: string): Promise<boolean>;
    sanitize(): UserWithoutPassword;
}

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre<UserDocument>("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!));
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function (
    userPassword: string
): Promise<boolean> {
    return bcrypt.compare(userPassword, this.password);
};

userSchema.methods.sanitize = function (): UserWithoutPassword {
    const user = this.toObject();
    const sanitizedUser = { username: user.username, email: user.email };
    return sanitizedUser;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
