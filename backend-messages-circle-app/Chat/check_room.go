package chat

import (
	"encoding/json"
	"net/http"
	"strings"

	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	model "github.com/socotree/backend-messages-circle-app/Models"
)

func checkGroup(w http.ResponseWriter, req *http.Request) {
	groupPath := strings.TrimPrefix(req.URL.Path, "/v1/addchatgroup/")

	uuidGroup, err := uuid.FromString(groupPath)
	if err == nil {
		if !contains(groupEventsList, uuidGroup) && existsEvent(uuidGroup) {
			groupEventsList = append(groupEventsList, uuidGroup)
			createGroupChat(groupPath)
		}
	}

	j, _ := json.Marshal(&model.Success{
		Success: true,
	})

	w.Write(j)
}

func checkCircle(w http.ResponseWriter, req *http.Request) {
	circlePath := strings.TrimPrefix(req.URL.Path, "/v1/addcircle/")
	uuidCircle, err := uuid.FromString(circlePath)
	if err == nil {
		if !contains(circlesList, uuidCircle) && existsCircle(uuidCircle) {
			circlesList = append(circlesList, uuidCircle)
			createCircleChat(circlePath)
		}
	}

	j, _ := json.Marshal(&model.Success{
		Success: true,
	})

	w.Write(j)
}

func existsEvent(id uuid.UUID) bool {
	events, err := dal.ReadEventsNoTime()
	if err != nil {
		return false
	}
	for _, event := range events {
		if event.ID == id {
			return true
		}
	}
	return false
}

func existsCircle(id uuid.UUID) bool {
	circles, err := dal.ReadCirclesNoUsers()
	if err != nil {
		return false
	}
	for _, circle := range circles {
		if circle.CircleID == id {
			return true
		}
	}
	return false
}

func contains(arr []uuid.UUID, str uuid.UUID) bool {
	for _, elem := range arr {
		if elem == str {
			return true
		}
	}
	return false
}
