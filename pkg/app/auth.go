package app

import (
	"fmt"
	"net/http"

	"github.com/bwmarrin/discordgo"
	"github.com/labstack/echo/v4"

	"github.com/nint8835/discord-achievements/pkg/database"
)

func (a *App) handleCurrentUser(c echo.Context) error {
	sess := getSession(c)

	if _, loggedIn := sess.Values["user_id"]; !loggedIn {
		return c.JSON(http.StatusOK, nil)
	}

	user, err := database.Instance.GetUser(c.Request().Context(), sess.Values["user_id"].(string))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("error fetching user: %s", err))
	}

	return c.JSON(http.StatusOK, user)
}

func (a *App) handleLogin(c echo.Context) error {
	sess := getSession(c)

	if _, loggedIn := sess.Values["user_id"]; loggedIn {
		return c.Redirect(http.StatusTemporaryRedirect, "/")
	}

	return c.Redirect(http.StatusTemporaryRedirect, a.oauth2Config.AuthCodeURL("state"))
}

func (a *App) handleCallback(c echo.Context) error {
	code := c.QueryParam("code")
	state := c.QueryParam("state")

	if state != "state" {
		return echo.NewHTTPError(http.StatusForbidden, "Invalid state")
	}

	token, err := a.oauth2Config.Exchange(c.Request().Context(), code)
	if err != nil {
		return echo.NewHTTPError(http.StatusForbidden, "Invalid code")
	}

	discordClient, _ := discordgo.New(fmt.Sprintf("Bearer %s", token.AccessToken))
	user, err := discordClient.User("@me")
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("error fetching user details: %s", err))
	}

	dbUser, err := database.CreateOrUpdateDiscordUser(c.Request().Context(), user)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("error creating or updating user: %s", err))
	}

	sess := getSession(c)
	sess.Values["user_id"] = dbUser.ID
	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("error saving session: %s", err))
	}

	return c.Redirect(http.StatusTemporaryRedirect, "/")
}

func (a *App) handleLogout(c echo.Context) error {
	sess := getSession(c)
	delete(sess.Values, "user_id")
	err := sess.Save(c.Request(), c.Response())
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("error saving session: %s", err))
	}

	return c.Redirect(http.StatusTemporaryRedirect, "/")
}
