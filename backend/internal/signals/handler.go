package signals

import (
	"ct/test/internal/data"
	"ct/test/models"
	"errors"
	"io/fs"
	"net/http"

	"github.com/labstack/echo/v5"
)

func GetSignals(c *echo.Context) error {
	data, err := data.Load()
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			c.Logger().Error("data.json not found")
			return echo.NewHTTPError(http.StatusInternalServerError, "unable to load the track data")
		}

		c.Logger().Error("failed to load the track data:", "err", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "unable to load the track data")
	}

	var s []models.Signal
	for _, t := range data {
		for _, si := range *t.Signals {
			s = append(s, models.Signal{SignalId: si.SignalId, SignalName: si.SignalName})
		}
	}

	return c.JSON(http.StatusOK, s)
}
