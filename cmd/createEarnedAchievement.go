package cmd

import (
	"context"
	"strconv"

	"github.com/AlecAivazis/survey/v2"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var createEarnedAchievementCmd = &cobra.Command{
	Use:   "earned-achievement",
	Short: "Create a new earned achievement",
	Run: func(cmd *cobra.Command, args []string) {
		answers := struct {
			AchievementID string
			UserID        string
		}{}

		err := survey.Ask([]*survey.Question{
			{
				Name:   "AchievementID",
				Prompt: achievementPrompt("Achievement:", false),
			},
			{
				Name:   "UserID",
				Prompt: userPrompt("User:"),
			},
		}, &answers)
		if err != nil {
			log.Fatal().Err(err).Msg("Error getting input values")
		}

		achievementId, _ := strconv.ParseInt(answers.AchievementID, 10, 64)

		earnedAchievement, err := database.Instance.CreateEarnedAchievement(context.Background(), database.CreateEarnedAchievementParams{
			AchievementID: achievementId,
			UserID:        answers.UserID,
		})
		if err != nil {
			log.Fatal().Err(err).Msg("Error creating earned achievement")
		}

		log.Info().Int64("id", earnedAchievement.ID).Msg("Created earned achievement")
	},
}

func init() {
	createCmd.AddCommand(createEarnedAchievementCmd)
}
