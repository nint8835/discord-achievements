package cmd

import (
	"context"
	"fmt"

	"github.com/AlecAivazis/survey/v2"
	"github.com/rs/zerolog/log"

	"github.com/nint8835/discord-achievements/pkg/database"
)

func userPrompt(db *database.Queries, prompt string) *survey.Select {
	users, err := db.GetAllUsers(context.Background())
	if err != nil {
		log.Fatal().Err(err).Msg("Error getting users")
	}

	var ids []string
	var usernames []string

	for _, user := range users {
		ids = append(ids, user.ID)
		usernames = append(usernames, fmt.Sprintf("%s#%s", user.Username, user.Discriminator))
	}

	return &survey.Select{
		Message: prompt,
		Options: ids,
		Description: func(value string, index int) string {
			return usernames[index]
		},
	}
}

func achievementBundlePrompt(db *database.Queries, prompt string, nullable bool) *survey.Select {
	bundles, err := db.GetAllAchievementBundles(context.Background())
	if err != nil {
		log.Fatal().Err(err).Msg("Error getting bundles")
	}

	var ids []string
	var names []string

	for _, bundle := range bundles {
		ids = append(ids, fmt.Sprint(bundle.ID))
		names = append(names, bundle.Name)
	}

	if nullable {
		ids = append(ids, "")
		names = append(names, "null")
	}

	return &survey.Select{
		Message: prompt,
		Options: ids,
		Description: func(value string, index int) string {
			return names[index]
		},
	}
}
