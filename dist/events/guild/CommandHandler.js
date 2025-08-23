"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Events_1 = __importDefault(require("@classes/Events"));
/**
 * @class CommandHandler
 * @extends Event
 * @description Handles all incoming slash command interactions,
 * including subcommands and cooldown logic.
 */
class CommandHandler extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.InteractionCreate,
            description: "Processes all incoming slash command interactions.",
            once: false,
        });
    }
    /**
     * @method Execute
     * @param interaction ChatInputCommandInteraction
     * @description Routes the interaction to its corresponding command or subcommand,
     * and manages cooldowns for each command.
     */
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            let embed = new discord_js_1.EmbedBuilder().setColor(0x242429);
            if (!interaction.isChatInputCommand())
                return;
            const command = this.client.Commands.get(interaction.commandName);
            if (!command) {
                embed.setDescription("❌ The requested command could not be found.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (command.dev &&
                !((_b = (_a = this.client.config) === null || _a === void 0 ? void 0 : _a.devUserId) === null || _b === void 0 ? void 0 : _b.includes(interaction.user.id)))
                embed.setDescription("⚠️ This command is restricted to development users.");
            const now = Date.now();
            const cooldowns = (_c = this.client.cooldown.get(command.name)) !== null && _c !== void 0 ? _c : new discord_js_1.Collection();
            this.client.cooldown.set(command.name, cooldowns);
            const cooldownMs = ((_d = command.cooldown) !== null && _d !== void 0 ? _d : 3) * 1000;
            const expiresAt = (_e = cooldowns.get(interaction.user.id)) !== null && _e !== void 0 ? _e : 0;
            if (now < expiresAt) {
                const secondsLeft = Math.ceil((expiresAt - now) / 1000);
                embed.setDescription(`⏳ Please wait \`${secondsLeft}\` more second(s) before reusing the \`/${command.name}\` command.`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            cooldowns.set(interaction.user.id, now + cooldownMs);
            setTimeout(() => cooldowns.delete(interaction.user.id), cooldownMs);
            try {
                const group = interaction.options.getSubcommandGroup(false);
                const sub = interaction.options.getSubcommand(false);
                if (sub) {
                    const key = group
                        ? `${interaction.commandName} ${group}.${sub}`
                        : `${interaction.commandName}.${sub}`;
                    const subCommand = this.client.subCommands.get(key);
                    if (subCommand)
                        return subCommand.Execute(interaction);
                }
                return command.Execute(interaction);
            }
            catch (err) {
                console.error("❌ An unexpected error occurred during command execution:", err);
                embed.setDescription("❌ An unexpected error occurred while attempting to execute this command.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        });
    }
}
exports.default = CommandHandler;
