import { ApplicationCommandOptionType } from "discord.js";
declare enum Types {
    SubCommand = 1,
    SubCommandGroup = 2,
    String = 3,
    Integer = 4,
    Boolean = 5,
    User = 6,
    Channel = 7,
    Role = 8,
    Mentionable = 9,
    Number = 10,
    Attachment = 11
}
export default Types;
type BuiltInTypes = string | number | boolean | object | null | undefined;
export type ExtendedTypes = BuiltInTypes | Types | ApplicationCommandOptionType;
