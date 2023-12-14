package notifications

import (
	"encoding/json"
	"net/http"
)

var version = "undefined"

// Health is the model for the health server
type Health struct {
	Version string
	App     string
}

//HealthRequest is the method to give info to the health end point
func HealthRequest(w http.ResponseWriter, r *http.Request) {
	h := &Health{
		Version: version,
		App:     "Notifications",
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(h)
}
