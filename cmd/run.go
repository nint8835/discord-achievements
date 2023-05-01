package cmd

import (
	"log"

	"github.com/spf13/cobra"

	"github.com/nint8835/discord-achievements/pkg/app"
	"github.com/nint8835/discord-achievements/pkg/bot"
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

		botInst, err := bot.New()
		if err != nil {
			log.Fatalf("error creating bot: %s", err)
		}

		go func() {
			err := botInst.Start()
			if err != nil {
				log.Fatalf("error starting bot: %s", err)
			}
		}()

		err = appInst.Serve()
		if err != nil {
			log.Fatalf("error serving app: %s", err)
		}

		botInst.Stop()
	},
}

func init() {
	rootCmd.AddCommand(runCmd)
}
