package cmd

import (
	"errors"
	"strconv"

	"github.com/golang-migrate/migrate/v4"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var dbStepCmd = &cobra.Command{
	Use: "step [number of steps]",
	Example: `  Downgrade by one version: discord-achievements db step -- -1
  Upgrade by 3 versions: discord-achievements db step 3`,
	Short: "Perform a relative migration",
	Long: `Perform a database migration of a certain number of steps relative to the current version.

Negative step count equals a downgrade by that number of versions.
Positive step count equals an upgrade by that number of versions.

Note: to use a negative number of steps, you must use -- to explicitly denote that you are passing a negative number as a positional argument.
Otherwise, it will be interpreted as shorthand for a flag.
`,
	Args: cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		m, err := database.NewMigrateInstance()
		if err != nil {
			log.Fatal().Err(err).Msg("Error setting up migrations")
		}

		stepCountStr := args[0]

		stepCount, err := strconv.Atoi(stepCountStr)
		if err != nil {
			log.Fatal().Err(err).Msg("Invalid step count")
		}

		log.Info().Msg("Performing database migration...")
		err = m.Steps(stepCount)
		if err != nil {
			if errors.Is(err, migrate.ErrNoChange) {
				log.Info().Msg("Database is already at desired version.")
				return
			} else {
				log.Fatal().Err(err).Msg("Error upgrading database")
			}
		}

		log.Info().Msg("Database migrations complete!")
	},
}

func init() {
	dbCmd.AddCommand(dbStepCmd)
}
