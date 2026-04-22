## CrossTech test

This program uses Echo to create API's that read from a .json data source. It exposes API's listed below.

### Running the code

To start the program run
`go run server.go`

## Data validation and cleanup

The json data file included Python-style NaN values. I treated them as missing values rather than converting them to 0.

## Endpoints

### GetTracks

Fetches all track data and the signals associated with it.

Returned data format

```
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

### GetTrackByID

Fetches track data for a single track found using its id.

Returned data format

```
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

### GetSignals

Fetches all track data, filters this to leave only signal data.

Returned data format

```
[]{
SignalId int
SignalName string
}
```

### GetSignalByID

Fetches all track data, filters this to leave only signal data. Then filters again to find a signal by using its id.

Returned data format

```
SignalId int
SignalName string
```
