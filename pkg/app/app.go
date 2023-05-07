package app

import (
	"embed"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	glog "github.com/labstack/gommon/log"
	"github.com/rs/zerolog/log"
	"github.com/ziflex/lecho/v3"
	"golang.org/x/oauth2"

	"github.com/nint8835/discord-achievements/pkg/config"
)

//go:embed frontend/dist
var frontendFS embed.FS

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

	var configuredFrontendFS http.FileSystem
	if config.Instance.UseBundledAssets {
		configuredFrontendFS = http.FS(frontendFS)
	} else {
		configuredFrontendFS = http.Dir("./pkg/app/")
	}

	echoInst.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:       "frontend/dist",
		Index:      "index.html",
		Browse:     false,
		HTML5:      true,
		Filesystem: configuredFrontendFS,
	}))

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

	authGroup := echoInst.Group("/auth")
	authGroup.GET("/user", appInst.handleCurrentUser)
	authGroup.GET("/login", appInst.handleLogin)
	authGroup.GET("/callback", appInst.handleCallback)
	authGroup.GET("/logout", appInst.handleLogout)

	achievementBundleGroup := echoInst.Group("/achievement-bundles")
	achievementBundleGroup.GET("/owned", appInst.handleOwnedBundles)

	return appInst, nil
}
