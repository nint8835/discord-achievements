package cmd

import (
	"context"

	"github.com/AlecAivazis/survey/v2"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var createAchievementBundleCmd = &cobra.Command{
	Use:   "achievement-bundle",
	Short: "Create a new achievement bundle",
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
			{
				Name:   "Description",
				Prompt: &survey.Input{Message: "Description:"},
			},
			{
				Name:   "ImageURL",
				Prompt: &survey.Input{Message: "Image URL:"},
			},
		}, &answers)
		if err != nil {
			log.Fatal().Err(err).Msg("Error getting input values")
		}

		bundle, err := database.Instance.CreateAchievementBundle(context.Background(), database.CreateAchievementBundleParams{
			OwnerID:     answers.OwnerID,
			Name:        answers.Name,
			Description: database.StringToNullString(answers.Description),
			ImageUrl:    database.StringToNullString(answers.ImageUrl),
		})
		if err != nil {
			log.Fatal().Err(err).Msg("Error creating achievement bundle")
		}

		log.Info().Int64("id", bundle.ID).Msg("Achievement bundle created")
	},
}

func init() {
	createCmd.AddCommand(createAchievementBundleCmd)
}
