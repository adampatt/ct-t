package models

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
