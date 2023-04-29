package cmd

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/AlecAivazis/survey/v2"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var createAchievementCmd = &cobra.Command{
	Use:   "achievement",
	Short: "Create a new achievement",
	Run: func(cmd *cobra.Command, args []string) {
		queries, err := database.Connect()
		if err != nil {
			log.Fatal().Err(err).Msg("Error connecting to database")
		}

		answers := struct {
			OwnerID     string
			BundleID    string
			Name        string
			Description string
			ImageUrl    string
		}{}

		err = survey.Ask([]*survey.Question{
			{
				Name:   "OwnerID",
				Prompt: userPrompt(queries, "Owner:"),
			},
			{
				Name:   "BundleID",
				Prompt: achievementBundlePrompt(queries, "Bundle:", true),
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

		var bundleID int64
		if answers.BundleID != "" {
			bundleID, _ = strconv.ParseInt(answers.BundleID, 10, 64)
		}

		achievement, err := queries.CreateAchievement(context.Background(), database.CreateAchievementParams{
			OwnerID:     answers.OwnerID,
			BundleID:    sql.NullInt64{Int64: bundleID, Valid: answers.BundleID != ""},
			Name:        answers.Name,
			Description: database.StringToNullString(answers.Description),
			ImageUrl:    database.StringToNullString(answers.ImageUrl),
		})
		if err != nil {
			log.Fatal().Err(err).Msg("Error creating achievement")
		}

		log.Info().Int64("id", achievement.ID).Msg("Achievement created")
	},
}

func init() {
	createCmd.AddCommand(createAchievementCmd)
}
