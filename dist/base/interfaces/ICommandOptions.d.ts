import Category from "@enums/Category";
export default interface ICommandOptions {
    name: string;
    description: string;
    category: Category;
    options: object;
    DefaultMemberPermissions: bigint;
    dmPermission: boolean;
    cooldown: number;
    dev: boolean;
}
