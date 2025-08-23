import _Client from "@classes/_Client";
import ICommandOptions from "./ICommandOptions";

export default interface ISubCommand extends Partial<ICommandOptions> {
    name: string;    
}