package cmd

import (
	"log"

	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/app"
)

var runCmd = &cobra.Command{
	Use:   "run",
	Short: "Run the app",
	Args:  cobra.NoArgs,
	Run: func(cmd *cobra.Command, args []string) {
		appInst, err := app.New()
		if err != nil {
			log.Fatalf("error creating app: %s", err)
		}

		err = appInst.Serve()
		if err != nil {
			log.Fatalf("error serving app: %s", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(runCmd)
}
