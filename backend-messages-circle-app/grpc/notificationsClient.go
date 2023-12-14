package grpc

import (
	"context"
	"log"

	pb "github.com/socotree/backend-notifications-circles-app/grpc"

	"google.golang.org/grpc"
)

const (
	portNotifications = "811"
)

// connectNotifications Connect to the notifications server
func connectNotifications() (*grpc.ClientConn, pb.ServicesPushNotificationsClient) {
	log.Printf("Trying to connect to the Notifications GRPC server from messages system...")
	// Set up a connection to the server.
	conn, err := grpc.Dial("app_notifications:"+portNotifications, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Failed to connect to grpc notification server: %v", err)
	}

	c := pb.NewServicesPushNotificationsClient(conn)

	return conn, c
}

// ConnectNotificationsChats Connect to the notifications server and send messages to chatters
func ConnectNotificationsChats(title string, message string, userid string, circleid string, tokens []string) {
	conn, c := connectNotifications()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	messageChat := &pb.PNMessageChat{
		Title:    title,
		Body:     message,
		Tokens:   tokens,
		Userid:   userid,
		Circleid: circleid}

	r, err := c.PNChatMessage(ctx, messageChat)
	if err != nil {
		log.Printf("PNChatMessage NOT Sent: %v, %v", r.GetSuccess(), err)
	} else {
		log.Printf("PNChatMessage Sent: %v", r.GetSuccess())
	}
}
