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

var createIntegrationPermissionCmd = &cobra.Command{
	Use:   "integration-permission",
	Short: "Create a new integration permission",
	Run: func(cmd *cobra.Command, args []string) {
		answers := struct {
			IntegrationID string
			AchievementID string
			BundleID      string
		}{}

		err := survey.Ask([]*survey.Question{
			{
				Name:   "IntegrationID",
				Prompt: integrationPrompt("Integration:"),
			},
			{
				Name:   "AchievementID",
				Prompt: achievementPrompt("Achievement:", true),
			},
			{
				Name:   "BundleID",
				Prompt: achievementBundlePrompt("Bundle:", true),
			},
		}, &answers)
		if err != nil {
			log.Fatal().Err(err).Msg("Error getting input values")
		}

		integrationId, _ := strconv.ParseInt(answers.IntegrationID, 10, 64)

		var achievementId sql.NullInt64
		if answers.AchievementID != "" {
			achievementId.Int64, _ = strconv.ParseInt(answers.AchievementID, 10, 64)
			achievementId.Valid = true
		}

		var bundleId sql.NullInt64
		if answers.BundleID != "" {
			bundleId.Int64, _ = strconv.ParseInt(answers.BundleID, 10, 64)
			bundleId.Valid = true
		}

		integrationPermission, err := database.Instance.CreateIntegrationPermission(context.Background(), database.CreateIntegrationPermissionParams{
			IntegrationID:       integrationId,
			AchievementID:       achievementId,
			AchievementBundleID: bundleId,
		})
		if err != nil {
			log.Fatal().Err(err).Msg("Error creating integration permission")
		}

		log.Info().Int64("id", integrationPermission.ID).Msg("Created integration permission")
	},
}

func init() {
	createCmd.AddCommand(createIntegrationPermissionCmd)
}
