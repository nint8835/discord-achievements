package cmd

import (
	"fmt"

	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var dbVersionCmd = &cobra.Command{
	Use:   "version",
	Short: "Fetch the current database version",
	Run: func(cmd *cobra.Command, args []string) {
		m, err := database.NewMigrateInstance()
		if err != nil {
			log.Fatal().Err(err).Msg("Error setting up migrations")
		}

		version, dirty, err := m.Version()
		if err != nil {
			log.Fatal().Err(err).Msg("Error getting database version")
		}

		log.Info().Bool("dirty", dirty).Msg(fmt.Sprintf("Version %d", version))
	},
}

func init() {
	dbCmd.AddCommand(dbVersionCmd)
}
