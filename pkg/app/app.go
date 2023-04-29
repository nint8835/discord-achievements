package app

import (
	"github.com/labstack/echo/v4"
	glog "github.com/labstack/gommon/log"
	"github.com/rs/zerolog/log"
	"github.com/ziflex/lecho/v3"

	"github.com/nint8835/discord-achievements/pkg/config"
)

type App struct {
	echo *echo.Echo
}

func (a *App) Serve() error {
	return a.echo.Start(config.Instance.BindAddr)
}

func New() (*App, error) {
	echoInst := echo.New()

	logger := lecho.From(log.Logger, lecho.WithLevel(glog.INFO))
	echoInst.Logger = logger
	echoInst.Use(lecho.Middleware(lecho.Config{Logger: logger}))

	appInst := &App{
		echo: echoInst,
	}

	echoInst.GET("/", func(c echo.Context) error {
		return c.String(200, "Hello, world!")
	})

	return appInst, nil
}
