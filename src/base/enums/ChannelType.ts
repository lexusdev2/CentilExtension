import { ChannelType as DiscordChannelType } from "discord.js";

enum CT {
    GuildText = DiscordChannelType.GuildText,
    DM = DiscordChannelType.DM,
    GuildVoice = DiscordChannelType.GuildVoice,
    GroupDM = DiscordChannelType.GroupDM,
    GuildCategory = DiscordChannelType.GuildCategory,
    GuildAnnouncement = DiscordChannelType.GuildAnnouncement,
    AnnouncementThread = DiscordChannelType.AnnouncementThread,
    PublicThread = DiscordChannelType.PublicThread,
    PrivateThread = DiscordChannelType.PrivateThread,
    GuildStageVoice = DiscordChannelType.GuildStageVoice,
    GuildDirectory = DiscordChannelType.GuildDirectory,
    GuildForum = DiscordChannelType.GuildForum,
    GuildMedia = DiscordChannelType.GuildMedia,
}

export default CT;
