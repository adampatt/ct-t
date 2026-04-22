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
	_, signals, err := data.Load()
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			c.Logger().Error("data.json not found")
			return echo.NewHTTPError(http.StatusInternalServerError, "unable to load the track data")
		}

		c.Logger().Error("failed to load the track data:", "err", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "unable to load the track data")
	}

	var s []models.Signal
	for _, sig := range signals {
		s = append(s, models.Signal{SignalId: sig.SignalId, SignalName: sig.SignalName})
	}

	return c.JSON(http.StatusOK, s)
}

func GetSignalByID(c *echo.Context) error {
	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid signal id")
	}

	tracks, _, err := data.Load()
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			c.Logger().Error("data.json not found")
			return echo.NewHTTPError(http.StatusInternalServerError, "unable to load data")
		}
		c.Logger().Error("failed to load data", "err", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "unable to load data")
	}

	response := models.SignalResponse{}
	found := false

	for _, t := range tracks {
		for _, s := range t.Signals {
			if s.SignalId == id {
				if !found {
					response.SignalId = s.SignalId
					response.SignalName = s.SignalName
					found = true
				}
				response.Tracks = append(response.Tracks, models.SignalTrack{
					TrackId: t.TrackId,
					Source:  t.Source,
					Target:  t.Target,
					Elr:     s.Elr,
					Mileage: s.Mileage,
				})
			}
		}
	}

	if !found {
		return echo.NewHTTPError(http.StatusNotFound, "signal not found")
	}

	return c.JSON(http.StatusOK, response)
}
