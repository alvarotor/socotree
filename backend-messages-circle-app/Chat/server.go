package chat

import (
	"fmt"
	"log"
	"net/http"
	"os"

	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
)

var groupEventsList []uuid.UUID
var circlesList []uuid.UUID
var events []models.Event
var circles []models.Circle

// Run starts a new chat server with rooms, listening on port 8484
func Run() {
	env := os.Getenv("HOST")
	if len(env) == 0 {
		env = "localhost"
	}
	fs := http.FileServer(http.Dir("./Chat/Static"))
	http.Handle("/", fs)

	var err error
	events, err = dal.ReadEventsNoTime()
	if err != nil {
		log.Fatal("Could not read events: ", err)
	}

	circles, err = dal.ReadCirclesNoUsers()
	if err != nil {
		log.Fatal("Could not read circles: ", err)
	}

	for _, event := range events {
		groupEventsList = append(groupEventsList, event.ID)
		createGroupChat(event.ID.String())
	}

	for _, circle := range circles {
		if !contains(circlesList, circle.CircleID) {
			circlesList = append(circlesList, circle.CircleID)
			createCircleChat(circle.CircleID.String())
		}
	}

	http.HandleFunc("/v1/addchatgroup/", checkGroup)
	http.HandleFunc("/v1/addcircle/", checkCircle)

	fmt.Println(fmt.Sprintf("Server started at http://%s:8484/", env))
	if err := http.ListenAndServe(":8484", nil); err != nil {
		log.Fatal("Starting server failed: ", err)
	}
}
