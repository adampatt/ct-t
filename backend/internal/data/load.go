package data

import (
	"bytes"
	"ct/test/models"
	"encoding/json"
	"os"
)

func Load() ([]models.TrackResponse, []models.Signal, error) {
	data, err := os.ReadFile("data.json")
	if err != nil {
		return nil, nil, err
	}

	data = bytes.ReplaceAll(data, []byte("NaN"), []byte("null"))

	var tracks []models.TrackInput
	if err := json.Unmarshal(data, &tracks); err != nil {
		return nil, nil, err
	}

	return transform(tracks)
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
