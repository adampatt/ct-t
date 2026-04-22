package main

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	type SignalInput struct {
		SignalId   int      `json:"signal_id"`
		SignalName string   `json:"signal_name"`
		Elr        string   `json:"elr"`
		Mileage    *float64 `json:"mileage"`
	}

	type TrackInput struct {
		TrackId int            `json:"track_id"`
		Source  string         `json:"source"`
		Target  string         `json:"target"`
		Signals *[]SignalInput `json:"signal_ids"`
	}

	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
