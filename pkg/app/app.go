package app

import (
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	glog "github.com/labstack/gommon/log"
	"github.com/rs/zerolog/log"
	"github.com/ziflex/lecho/v3"
	"golang.org/x/oauth2"

	"github.com/nint8835/discord-achievements/pkg/config"
)

type App struct {
	echo         *echo.Echo
	oauth2Config *oauth2.Config
}

func (a *App) Serve() error {
	return a.echo.Start(config.Instance.BindAddr)
}

func New() (*App, error) {
	echoInst := echo.New()
	echoInst.Use(session.Middleware(sessions.NewCookieStore(config.Instance.SessionSecret)))

	logger := lecho.From(log.Logger, lecho.WithLevel(glog.INFO))
	echoInst.Logger = logger
	echoInst.Use(lecho.Middleware(lecho.Config{Logger: logger}))

	appInst := &App{
		echo: echoInst,
		oauth2Config: &oauth2.Config{
			ClientID:     config.Instance.DiscordClientId,
			ClientSecret: config.Instance.DiscordClientSecret,
			Scopes:       []string{"identify"},
			RedirectURL:  config.Instance.DiscordCallbackUrl,
			Endpoint: oauth2.Endpoint{
				AuthURL:  "https://discordapp.com/api/oauth2/authorize",
				TokenURL: "https://discordapp.com/api/oauth2/token",
			},
		},
	}

	echoInst.GET("/", func(c echo.Context) error {
		sess := getSession(c)

		if _, loggedIn := sess.Values["user_id"]; loggedIn {
			return c.String(200, "Logged in")
		} else {
			return c.String(200, "Not logged in")
		}
	})

	echoInst.GET("/auth/login", appInst.handleLogin)
	echoInst.GET("/auth/callback", appInst.handleCallback)

	return appInst, nil
}
