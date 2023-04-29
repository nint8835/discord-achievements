package app

import (
	"github.com/labstack/echo/v4"
)

type App struct {
	echo *echo.Echo
}

func (a *App) Serve() error {
	// TODO: Make non-hardcoded once I implement config parsing
	return a.echo.Start(":8080")
}

func New() (*App, error) {
	echoInst := echo.New()

	appInst := &App{
		echo: echoInst,
	}

	echoInst.GET("/", func(c echo.Context) error {
		return c.String(200, "Hello, world!")
	})

	return appInst, nil
}
