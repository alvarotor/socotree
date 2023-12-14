package graphql

import (
	"encoding/json"
	"net/http"

	models "github.com/socotree/backend-circle-app/Models"
)

var version = "undefined"

//HealthRequest is the method to give info to the health end point
func HealthRequest(w http.ResponseWriter, r *http.Request) {
	h := &models.Health{
		Version: version,
		App:     "Backend",
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(h)
}
