import { ApplicationCommandOptionType } from "discord.js";

enum Types {
    SubCommand = ApplicationCommandOptionType.Subcommand,
    SubCommandGroup = ApplicationCommandOptionType.SubcommandGroup,
    String = ApplicationCommandOptionType.String,
    Integer = ApplicationCommandOptionType.Integer,
    Boolean = ApplicationCommandOptionType.Boolean,
    User = ApplicationCommandOptionType.User,
    Channel = ApplicationCommandOptionType.Channel,
    Role = ApplicationCommandOptionType.Role,
    Mentionable = ApplicationCommandOptionType.Mentionable,
    Number = ApplicationCommandOptionType.Number,
    Attachment = ApplicationCommandOptionType.Attachment,
}

export default Types;

type BuiltInTypes = string | number | boolean | object | null | undefined;

export type ExtendedTypes = BuiltInTypes | Types | ApplicationCommandOptionType;
