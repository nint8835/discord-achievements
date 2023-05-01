package bot

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"pkg.nit.so/switchboard"

	"github.com/nint8835/discord-achievements/pkg/config"
	"github.com/nint8835/discord-achievements/pkg/database"
)

func syncUsersCommand(sess *discordgo.Session, interaction *discordgo.InteractionCreate, _ struct{}) error {
	guilds, err := sess.UserGuilds(100, "", "")
	if err != nil {
		return fmt.Errorf("error getting guilds: %w", err)
	}

	for _, guild := range guilds {
		members, err := sess.GuildMembers(guild.ID, "", 1000)
		if err != nil {
			return fmt.Errorf("error getting guild members: %w", err)
		}

		for _, member := range members {
			_, err = database.Instance.CreateOrUpdateUser(context.Background(), database.CreateOrUpdateUserParams{
				ID:            member.User.ID,
				Username:      member.User.Username,
				Discriminator: member.User.Discriminator,
				AvatarUrl:     member.User.AvatarURL(""),
			})
			if err != nil {
				return fmt.Errorf("error syncing user: %w", err)
			}
		}
	}

	_ = sess.InteractionRespond(interaction.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "Synced users",
		},
	})
	return nil
}

func registerCommands(s *switchboard.Switchboard) {
	_ = s.AddCommand(&switchboard.Command{
		Name:        "syncusers",
		Description: "Sync users in the database with the users in all guilds the bot is in",
		GuildID:     config.Instance.DiscordTestingGuildId,
		Handler:     syncUsersCommand,
	})
}
