package tracks

import (
	"bytes"
	"ct/test/models"
	"encoding/json"
	"errors"
	"io/fs"
	"net/http"
	"os"
	"strconv"

	"github.com/labstack/echo/v5"
)

func load() ([]models.TrackInput, error) {
	data, err := os.ReadFile("data.json")
	if err != nil {
		return nil, err
	}

	data = bytes.ReplaceAll(data, []byte("NaN"), []byte("null"))

	var tracks []models.TrackInput
	if err := json.Unmarshal(data, &tracks); err != nil {
		return nil, err
	}

	return tracks, nil
}

func GetTracks(c *echo.Context) error {
	tracks, err := load()
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			c.Logger().Error("data.json not found")
			return echo.NewHTTPError(http.StatusInternalServerError, "unable to load the track data")
		}

		c.Logger().Error("failed to load the track data:", "err", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "unable to load the track data")
	}

	return c.JSON(http.StatusOK, tracks)
}

func GetTrackByID(c *echo.Context) error {
	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid track id")
	}

	tracks, err := load()
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			c.Logger().Error("data.json not found")
			return echo.NewHTTPError(http.StatusInternalServerError, "unable to load the track data")
		}

		c.Logger().Error("failed to load the track data", "err", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "unable to load the track data")
	}

	for _, t := range tracks {
		if t.TrackId == id {
			return c.JSON(http.StatusOK, t)
		}
	}

	return c.JSON(http.StatusNotFound, "unable to find track")
}
