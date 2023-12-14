package health

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

const (
	port = ":7134"
)

// HtmlRun starts a new chat server with rooms
func HtmlRun() {
	env := os.Getenv("HOST")

	http.HandleFunc("/v1/health/", HealthRequest)

	log.Println(fmt.Sprintf("Server Ticker started at http://%s%s/", env, port))
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Starting Ticker server failed on port "+port+": %v", err)
	}
}
