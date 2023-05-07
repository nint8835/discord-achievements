package app

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/nint8835/discord-achievements/pkg/database"
)

func (a *App) handleOwnedBundles(c echo.Context) error {
	sess := getSession(c)

	if _, loggedIn := sess.Values["user_id"]; !loggedIn {
		return c.JSON(http.StatusUnauthorized, nil)
	}

	bundles, err := database.Instance.GetAchievementBundlesOwnedByUser(c.Request().Context(), sess.Values["user_id"].(string))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("error fetching owned bundles: %s", err))
	}

	return c.JSON(http.StatusOK, bundles)
}
