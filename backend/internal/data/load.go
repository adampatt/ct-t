package data

import (
	"bytes"
	"ct/test/models"
	"encoding/json"
	"fmt"
	"os"
)

func validate(tracks []models.TrackResponse) error {
	for _, t := range tracks {
		if t.Source == "" {
			return fmt.Errorf("track with id %d has no source", t.TrackId)
		}
		if t.Target == "" {
			return fmt.Errorf("track with id %d missing target", t.TrackId)
		}
	}
	return nil
}

func Load() ([]models.TrackResponse, []models.Signal, error) {
	data, err := os.ReadFile("data.json")
	if err != nil {
		return nil, nil, err
	}

	data = bytes.ReplaceAll(data, []byte("NaN"), []byte("null"))

	var t []models.TrackInput
	if err := json.Unmarshal(data, &t); err != nil {
		return nil, nil, err
	}

	tracks, signals, err := transform(t)
	if err != nil {
		return nil, nil, err
	}

	if err := validate(tracks); err != nil {
		return nil, nil, fmt.Errorf("validation failed: %w", err)
	}

	return tracks, signals, nil
}

func transform(input []models.TrackInput) ([]models.TrackResponse, []models.Signal, error) {
	seenSignals := make(map[int]models.Signal)
	var tracks []models.TrackResponse

	for _, t := range input {
		track := models.TrackResponse{
			TrackId: t.TrackId,
			Source:  t.Source,
			Target:  t.Target,
		}
		for _, s := range t.Signals {
			track.Signals = append(track.Signals, models.TrackSignal{
				SignalId:   s.SignalId,
				SignalName: s.SignalName,
				Elr:        s.Elr,
				Mileage:    s.Mileage,
			})
			if _, exists := seenSignals[s.SignalId]; !exists {
				seenSignals[s.SignalId] = models.Signal{
					SignalId:   s.SignalId,
					SignalName: s.SignalName,
				}
			}
		}
		tracks = append(tracks, track)
	}

	signals := make([]models.Signal, 0, len(seenSignals))
	for _, s := range seenSignals {
		signals = append(signals, s)
	}

	return tracks, signals, nil
}
