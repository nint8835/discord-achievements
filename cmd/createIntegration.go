package cmd

import (
	"context"

	"github.com/AlecAivazis/survey/v2"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var createIntegrationCmd = &cobra.Command{
	Use:   "integration",
	Short: "Create a new integration",
	Run: func(cmd *cobra.Command, args []string) {
		answers := struct {
			OwnerID     string
			Name        string
			Description string
			ImageUrl    string
		}{}

		err := survey.Ask([]*survey.Question{
			{
				Name:   "OwnerID",
				Prompt: userPrompt("Owner:"),
			},
			{
				Name:     "Name",
				Prompt:   &survey.Input{Message: "Name:"},
				Validate: survey.Required,
			},
		}, &answers)
		if err != nil {
			log.Fatal().Err(err).Msg("Error getting input values")
		}

		integration, err := database.Instance.CreateIntegration(context.Background(), database.CreateIntegrationParams{
			OwnerID: answers.OwnerID,
			Name:    answers.Name,
		})
		if err != nil {
			log.Fatal().Err(err).Msg("Error creating integration")
		}

		log.Info().Int64("id", integration.ID).Msg("Created integration")
	},
}

func init() {
	createCmd.AddCommand(createIntegrationCmd)
}
