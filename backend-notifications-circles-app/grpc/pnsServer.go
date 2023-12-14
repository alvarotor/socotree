package grpc

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strconv"

	notifications "github.com/socotree/backend-notifications-circles-app/Notifications"
)

//ServerPushNotifications gRPC Push Notifications Server
type ServerPushNotifications struct {
	UnimplementedServicesPushNotificationsServer
}

//PNChatMessage Send PNs to people on chats
func (s *ServerPushNotifications) PNChatMessage(ctx context.Context, user *PNMessageChat) (*Response, error) {
	log.Printf("GRPC Notifications - Received pn for chat message: %s %s", user.GetTitle(), user.GetBody())
	data := map[string]string{
		"typepn":   user.GetTypepn(),
		"userid":   user.GetUserid(),
		"circleid": user.GetCircleid(),
	}
	err := notifications.SendPushNotification(user.GetTitle(), user.GetBody(), user.GetTokens(), data)
	if err > 0 {
		log.Printf(fmt.Sprintf("GRPC Notifications - SendPushNotification fail: %v", err) + "times")
		return &Response{Success: false}, errors.New("GRPC Notifications - SendPushNotification fail: " + strconv.Itoa(err) + " times")
	}
	return &Response{Success: true}, nil
}

//PNUserNewCircle Send pn with a user new circle
func (s *ServerPushNotifications) PNUserNewCircle(ctx context.Context, user *PNMessageNewCircle) (*Response, error) {
	log.Printf("GRPC Notifications - Received event id for user new event circle: %s %s", user.GetEventname(), user.GetEventid())
	err := notifications.PushNewCircleSend(user.GetEventid(), user.GetTypepn(), user.GetTokens(), user.GetEventname())
	if err > 0 {
		log.Printf(fmt.Sprintf("GRPC Notifications - PushNewCircleSend fail: %v", err) + "times")
		return &Response{Success: false}, errors.New("GRPC Notifications - PushNewCircleSend fail: " + strconv.Itoa(err) + " times")
	}
	return &Response{Success: true}, nil
}

//PNUserVerified Send pn with a user admin verified
func (s *ServerPushNotifications) PNUserVerified(ctx context.Context, user *PNMessageChat) (*Response, error) {
	log.Printf("GRPC Notifications - Received tokens for user admin verified: %s", user.GetTokens())
	err := notifications.PushUserVerified(user.GetTokens())
	if err > 0 {
		log.Printf(fmt.Sprintf("GRPC Notifications - PushUserVerified fail: %v", err) + "times")
		return &Response{Success: false}, errors.New("GRPC Notifications - PushUserVerified fail: " + strconv.Itoa(err) + " times")
	}
	return &Response{Success: true}, nil
}

//PNUserVerified Send pn with a user admin verified
func (s *ServerPushNotifications) PNUserRejected(ctx context.Context, user *PNMessageUserRejected) (*Response, error) {
	log.Printf("GRPC Notifications - Received tokens for user admin rejected: %s", user.GetToken())
	err := notifications.PNUserRejected(user.GetText(), user.GetToken())
	if err > 0 {
		log.Printf(fmt.Sprintf("GRPC Notifications - PNUserRejected fail: %v", err) + "times")
		return &Response{Success: false}, errors.New("GRPC Notifications - PNUserRejected fail: " + strconv.Itoa(err) + " times")
	}
	return &Response{Success: true}, nil
}
