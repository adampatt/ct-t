package data

import (
	"bytes"
	"ct/test/models"
	"encoding/json"
	"os"
)

func Load() ([]models.TrackInput, error) {
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
