package bot

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
	"pkg.nit.so/switchboard"

	"github.com/nint8835/discord-achievements/pkg/config"
)

type Bot struct {
	Session     *discordgo.Session
	Switchboard *switchboard.Switchboard
	quitChan    chan struct{}
}

func (b *Bot) Start() error {
	err := b.Session.Open()
	if err != nil {
		return fmt.Errorf("error opening discord session: %w", err)
	}

	<-b.quitChan

	err = b.Session.Close()
	if err != nil {
		return fmt.Errorf("error closing discord session: %w", err)
	}

	return nil
}

func (b *Bot) Stop() {
	b.quitChan <- struct{}{}
}

func New() (*Bot, error) {
	bot := &Bot{
		quitChan:    make(chan struct{}),
		Switchboard: &switchboard.Switchboard{},
	}

	session, err := discordgo.New("Bot " + config.Instance.DiscordToken)
	if err != nil {
		return nil, fmt.Errorf("error creating discord session: %w", err)
	}
	session.Identify.Intents = discordgo.IntentsAllWithoutPrivileged | discordgo.IntentsGuildMembers
	bot.Session = session

	session.AddHandler(bot.Switchboard.HandleInteractionCreate)
	registerCommands(bot.Switchboard)
	err = bot.Switchboard.SyncCommands(session, config.Instance.DiscordAppId)

	return bot, nil
}
