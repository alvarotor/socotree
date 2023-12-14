package roomevent

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	model "github.com/socotree/backend-messages-circle-app/Models"
	"github.com/socotree/backend-messages-circle-app/grpc"
)

func checkRoomCircleEvent(w http.ResponseWriter, req *http.Request) {
	circlePath := strings.TrimPrefix(req.URL.Path, AddCircleEventRoomURL)
	ids := strings.Split(circlePath, "@")

	event := ids[0]
	circle := ids[1]
	if !contains(circlesList, event+"@"+circle) && existsCircle(event, circle) && existsEvent(event) {
		circlesList = append(circlesList, event+"@"+circle)
		createCircleEventRoom(event, circle)
	}

	j, _ := json.Marshal(&model.Success{
		Success: true,
	})
	w.Write(j)
}

func existsEvent(id string) bool {
	if id == "00000000-0000-0000-0000-000000000000" {
		return true
	}
	events, err := grpc.ConnectReadEvents()
	if err != nil {
		log.Fatal("Error ConnectReadEvents ", err)
	}
	for _, event := range events {
		if event.GetEventid() == id {
			return true
		}
	}
	return false
}

func existsCircle(eventid string, circleid string) bool {
	EventCircles, err := grpc.ConnectReadEventsCircles()
	if err != nil {
		log.Fatal("Error ConnectReadEventsCircles ", err)
	}

	for _, eventCircle := range EventCircles {
		if eventCircle.GetCircleid() == circleid &&
			eventCircle.GetEventid() == eventid {
			return true
		}
	}
	return false
}

func contains(arr []string, str string) bool {
	for _, elem := range arr {
		if elem == str {
			return true
		}
	}
	return false
}
