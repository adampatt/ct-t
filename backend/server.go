package main

import (
	"ct/test/internal/signals"
	"ct/test/internal/tracks"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	e.GET("/tracks", tracks.GetTracks)
	e.GET("/tracks/:id", tracks.GetTrackByID)
	e.GET("/signals", signals.GetSignals)
	e.GET("/signals/:id", signals.GetSignalByID)

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
