package models

// Health is the model for the health server
type Health struct {
	Version string
	App     string
	Status  string
}
