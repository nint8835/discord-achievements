package cmd

import (
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var dbDropCmd = &cobra.Command{
	Use:   "drop",
	Short: "Completely empty the current database",
	Run: func(cmd *cobra.Command, args []string) {
		m, err := database.NewMigrateInstance()
		if err != nil {
			log.Fatal().Err(err).Msg("Error setting up migrations")
		}

		log.Info().Msg("Dropping database...")
		err = m.Drop()
		if err != nil {
			log.Fatal().Err(err).Msg("Error dropping database")
		}

		log.Info().Msg("Database dropped!")
	},
}

func init() {
	dbCmd.AddCommand(dbDropCmd)
}
