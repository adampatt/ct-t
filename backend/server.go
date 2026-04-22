package main

import (
	"ct/test/internal/tracks"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	e.GET("/tracks", tracks.GetTracks)
	e.GET("/tracks/:id", tracks.GetTrackByID)

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
