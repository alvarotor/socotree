package notifications

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

// Run starts a new server, listening on port 8111
func Run() {
	env := os.Getenv("HOST")
	if len(env) == 0 {
		env = "localhost"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/v1/health/", HealthRequest)
	mux.HandleFunc("/v1/mailreportprofile/", MailReportProfileSendDeprecated) // DELETE this line ASAP and its method

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowedHeaders: []string{"Accept", "content-type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Authentication"},
	})

	handler := c.Handler(mux)

	fmt.Println(fmt.Sprintf("Server http started at http://%s:8111/", env))
	if err := http.ListenAndServe(":8111", handler); err != nil {
		log.Fatal("Failed to serve http server over port 8111: ", err)
	}
}
