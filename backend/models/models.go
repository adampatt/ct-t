package models

type SignalInput struct {
	SignalId   int      `json:"signal_id"`
	SignalName string   `json:"signal_name"`
	Elr        string   `json:"elr"`
	Mileage    *float64 `json:"mileage"`
}

type TrackInput struct {
	TrackId int           `json:"track_id"`
	Source  string        `json:"source"`
	Target  string        `json:"target"`
	Signals []SignalInput `json:"signal_ids"`
}

type Signal struct {
	SignalId   int    `json:"signal_id"`
	SignalName string `json:"signal_name"`
}

type TrackResponse struct {
	TrackId int           `json:"track_id"`
	Source  string        `json:"source"`
	Target  string        `json:"target"`
	Signals []TrackSignal `json:"signals"`
}

type TrackSignal struct {
	SignalId   int      `json:"signal_id"`
	SignalName string   `json:"signal_name"`
	Elr        string   `json:"elr"`
	Mileage    *float64 `json:"mileage"`
}

type SignalResponse struct {
	SignalId   int           `json:"signal_id"`
	SignalName string        `json:"signal_name"`
	Tracks     []SignalTrack `json:"tracks"`
}

type SignalTrack struct {
	TrackId int      `json:"track_id"`
	Source  string   `json:"source"`
	Target  string   `json:"target"`
	Elr     string   `json:"elr"`
	Mileage *float64 `json:"mileage"`
}
