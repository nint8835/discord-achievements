package cmd

import (
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/database"
)

var createCmd = &cobra.Command{
	Use:   "create",
	Short: "Create new resources",
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		err := database.Connect()
		if err != nil {
			log.Fatal().Err(err).Msg("Error connecting to database")
		}
	},
}

func init() {
	rootCmd.AddCommand(createCmd)
}
