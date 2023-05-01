package cmd

import (
	"context"

	"github.com/AlecAivazis/survey/v2"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var createUserCmd = &cobra.Command{
	Use:   "user",
	Short: "Create a new user",
	Run: func(cmd *cobra.Command, args []string) {
		answers := struct {
			ID            string
			Username      string
			Discriminator string
			AvatarUrl     string
		}{}

		err := survey.Ask([]*survey.Question{
			{
				Name:   "ID",
				Prompt: &survey.Input{Message: "ID:"},
			},
			{
				Name:   "Username",
				Prompt: &survey.Input{Message: "Username:"},
			},
			{
				Name:   "Discriminator",
				Prompt: &survey.Input{Message: "Discriminator:"},
			},
			{
				Name:   "AvatarUrl",
				Prompt: &survey.Input{Message: "Avatar URL:"},
			},
		}, &answers)
		if err != nil {
			log.Fatal().Err(err).Msg("Error getting input values")
		}

		user, err := database.Instance.CreateUser(context.Background(), database.CreateUserParams{
			ID:            answers.ID,
			Username:      answers.Username,
			Discriminator: answers.Discriminator,
			AvatarUrl:     answers.AvatarUrl,
		})
		if err != nil {
			log.Fatal().Err(err).Msg("Error creating user")
		}

		log.Info().Str("id", user.ID).Msg("User created")
	},
}

func init() {
	createCmd.AddCommand(createUserCmd)
}
