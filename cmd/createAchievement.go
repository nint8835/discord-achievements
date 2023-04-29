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
			IsUnique    bool
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
			{
				Name:   "IsUnique",
				Prompt: &survey.Confirm{Message: "Is unique:"},
			},
		}, &answers)
		if err != nil {
			log.Fatal().Err(err).Msg("Error getting input values")
		}

		var bundleID sql.NullInt64
		if answers.BundleID != "" {
			bundleID.Int64, _ = strconv.ParseInt(answers.BundleID, 10, 64)
			bundleID.Valid = true
		}

		achievement, err := queries.CreateAchievement(context.Background(), database.CreateAchievementParams{
			OwnerID:     answers.OwnerID,
			BundleID:    bundleID,
			Name:        answers.Name,
			Description: database.StringToNullString(answers.Description),
			ImageUrl:    database.StringToNullString(answers.ImageUrl),
			IsUnique:    answers.IsUnique,
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
