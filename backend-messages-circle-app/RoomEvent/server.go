package roomevent

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/socotree/backend-messages-circle-app/grpc"
)

const (
	port = ":8485"
	//AddCircleEventRoomURL Add Room Circle URL
	AddCircleEventRoomURL = "/v2/circle_event_app/"
	//CircleEventRoomURL Room Circle URL
	CircleEventRoomURL = "/v2/circle_event/"
)

var circlesList []string

// Run starts a new chat server with rooms
func Run() {
	env := os.Getenv("HOST")

	circles, err := grpc.ConnectReadEventsCircles()
	if err != nil {
		log.Fatal("Error ConnectReadEventsCircles ", err)
	}

	for _, eventCircle := range circles {
		comb := eventCircle.GetEventid() + "@" + eventCircle.GetCircleid()
		if !contains(circlesList, comb) {
			circlesList = append(circlesList, comb)
			createCircleEventRoom(eventCircle.GetEventid(), eventCircle.GetCircleid())
		}
	}

	http.HandleFunc("/v1/health/", HealthRequest)
	http.HandleFunc(AddCircleEventRoomURL, checkRoomCircleEvent)

	log.Println(fmt.Sprintf("Server Messages started at http://%s%s/", env, port))
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Starting Messages server failed on port "+port+": %v", err)
	}
}
