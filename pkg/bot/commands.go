package bot

import (
	"github.com/bwmarrin/discordgo"
	"pkg.nit.so/switchboard"

	"github.com/nint8835/discord-achievements/pkg/config"
)

func registerCommands(s *switchboard.Switchboard) {
	_ = s.AddCommand(&switchboard.Command{
		Name:        "ping",
		Description: "Ping the bot",
		GuildID:     config.Instance.DiscordTestingGuildId,
		Handler: func(sess *discordgo.Session, interaction *discordgo.InteractionCreate, args struct{}) {
			_ = sess.InteractionRespond(interaction.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: "Pong!",
				},
			})
		},
	})
}
