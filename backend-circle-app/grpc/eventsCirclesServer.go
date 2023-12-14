package grpc

import (
	"context"
	"fmt"
	"log"

	dal "github.com/socotree/backend-circle-app/DAL"
)

//ServerEventsCircles gRPC Events Circles Server
type ServerEventsCircles struct {
	UnimplementedServicesEventsCirclesServer
}

//ReadEventsCircles Send Events Circles
func (s *ServerEventsCircles) ReadEventsCircles(ctx context.Context, params *ReadCirclesParams) (*ResponseEventsCircles, error) {
	log.Println("GRPC Circles - Received call for ReadEventsCircles")

	readCircles, err := dal.ReadCirclesNoUsers()
	if err != nil {
		log.Println(fmt.Sprintf("GRPC Circles - ReadCirclesNoUsers fail: %v", err))
		return &ResponseEventsCircles{Success: false}, err
	}

	var circles []*ResponseEventCircle
	for _, circle := range readCircles {
		responseEventCircle := ResponseEventCircle{
			Circleid: circle.CircleID.String(),
			Eventid:  circle.EventID.String(),
		}
		circles = append(circles, &responseEventCircle)
	}

	return &ResponseEventsCircles{Success: true, EventCircles: circles}, nil
}

//ReadEvents Send Events
func (s *ServerEventsCircles) ReadEvents(ctx context.Context, params *ReadCirclesParams) (*ResponseEvents, error) {
	log.Println("GRPC Circles - Received call for ReadEvents")

	readEvents, err := dal.ReadEvents()
	if err != nil {
		log.Println(fmt.Sprintf("GRPC Circles - ReadEvents fail: %v", err))
		return &ResponseEvents{Success: false}, err
	}

	var events []*ResponseEvent
	for _, event := range readEvents {
		responseEvent := ResponseEvent{
			Eventid: event.ID.String(),
			Name:    event.Name,
			Year:    int32(event.EventTime.Year),
			Month:   int32(event.EventTime.Month),
			Day:     int32(event.EventTime.Day),
			Hour:    int32(event.EventTime.Hour),
			Minute:  int32(event.EventTime.Minute),
		}
		events = append(events, &responseEvent)
	}

	return &ResponseEvents{Success: true, Events: events}, nil
}

//ReadEvents Send Events
func (s *ServerEventsCircles) ReadEventRegisteredUsers(ctx context.Context, params *ReadCirclesParams) (*ResponseUsers, error) {
	log.Println("GRPC Circles - Received call for ReadEventRegisteredUsers")

	usersRegistered, err := dal.ReadAllEventRegisterUsers(params.GetEventid())
	if err != nil {
		log.Println(fmt.Sprintf("GRPC Circles - ReadAllEventRegisterUsers fail: %v", err))
		return &ResponseUsers{Success: false}, err
	}

	var users []*ResponseUser
	for _, user := range usersRegistered {
		log.Println(user.User.Profile.Name, user.User.Profile.FcmToken)
		responseUsers := ResponseUser{
			Fcmtoken: user.User.Profile.FcmToken,
		}
		users = append(users, &responseUsers)
	}

	return &ResponseUsers{Success: true, Users: users}, nil
}
