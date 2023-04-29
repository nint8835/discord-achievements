package cmd

import (
	"os"

	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/config"
)

var rootCmd = &cobra.Command{
	Use:   "discord-achievements",
	Short: "Site & bot enabling earning and collection of custom achievements in Discord",
}

func init() {
	cobra.OnInitialize(initConfig)
}

func initConfig() {
	err := config.Load()
	if err != nil {
		log.Fatal().Err(err).Msg("error loading config")
	}
}

func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}
