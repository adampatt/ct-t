CrossTech test

This program uses Echo to create API's that read from a .json data source. It exposes 4 API's listed below.

To start the program run
`go run server.go`

GetTracks
Fetches all track data and the signals associated with it.

```
Output
[]{
TrackId int
Source  string
Target  string
Signals []{
    SignalId   int
	SignalName string
	Elr        string
	Mileage    *float64
    }
}
```

GetTrackByID
Fetches track data for a single track found using its id.

```
Output
TrackId int
Source  string
Target  string
Signals []{
    SignalId   int
	SignalName string
	Elr        string
	Mileage    *float64
}
```

GetSignals
Fetches all track data, filters this to leave only signal data.

```
Output
[]{
SignalId int
SignalName string
}
```

GetSignalByID
Fetches all track data, filters this to leave only signal data. Then filters again to find a signal by using its id.

```
Output
SignalId int
SignalName string
```
