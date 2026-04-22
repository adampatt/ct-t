package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"

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

	e.GET("/tracks", func(c *echo.Context) error {
		data, err := os.ReadFile("data.json")
		if err != nil {
			return err
		}

		data = bytes.ReplaceAll(data, []byte("NaN"), []byte("null"))

		var tracks []TrackInput
		if err := json.Unmarshal(data, &tracks); err != nil {
			return err
		}

		return c.JSON(http.StatusOK, tracks)
	})

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
