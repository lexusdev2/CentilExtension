import ICommandOptions from "./ICommandOptions";
export default interface ISubCommand extends Partial<ICommandOptions> {
    name: string;
}
