package signals

import (
	"ct/test/internal/data"
	"ct/test/models"
	"errors"
	"io/fs"
	"net/http"
	"strconv"

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

func GetSignalByID(c *echo.Context) error {
	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid signal id")
	}

	data, err := data.Load()
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			c.Logger().Error("data.json not found")
			return echo.NewHTTPError(http.StatusInternalServerError, "unable to load data")
		}

		c.Logger().Error("failed to load the track data", "err", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "unable to load data")
	}
	var s []models.Signal
	for _, t := range data {
		for _, si := range *t.Signals {
			s = append(s, models.Signal{SignalId: si.SignalId, SignalName: si.SignalName})
		}
	}

	for _, sig := range s {
		if sig.SignalId == id {
			return c.JSON(http.StatusOK, sig)
		}
	}

	return c.JSON(http.StatusNotFound, "signal not found")
}
