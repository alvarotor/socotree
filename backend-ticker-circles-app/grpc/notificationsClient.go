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

// connectNotificationsPN Connect to the PN notifications server
func connectNotificationsPN() (*grpc.ClientConn, pb.ServicesPushNotificationsClient) {
	log.Printf("Trying to connect to the Notifications PNS GRPC server from ticker system...")
	// Set up a connection to the server.
	conn, err := grpc.Dial("app_notifications:"+portNotifications, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Failed to connect to grpc notification server: %v", err)
	}

	c := pb.NewServicesPushNotificationsClient(conn)

	return conn, c
}

// connectNotificationsEmail Connect to the email notifications server
func connectNotificationsEmail() (*grpc.ClientConn, pb.ServicesEmailsClient) {
	log.Printf("Trying to connect to the Notifications EMAILS GRPC server from ticker system...")
	// Set up a connection to the server.
	conn, err := grpc.Dial("app_notifications:"+portNotifications, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Failed to connect to grpc notification server: %v", err)
	}

	c := pb.NewServicesEmailsClient(conn)

	return conn, c
}

// ConnectNotificationsPNs Connect to the notifications server and send pns to chatters
func ConnectNotificationsPNs(title string, message string, userid string, circleid string, tokens []string) {
	conn, c := connectNotificationsPN()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	messageChat := &pb.PNMessageChat{
		Typepn:   "remindevent",
		Title:    title,
		Body:     message,
		Tokens:   tokens,
		Userid:   userid,
		Circleid: circleid,
	}

	r, err := c.PNChatMessage(ctx, messageChat)
	if err != nil {
		log.Printf("PNChatMessage NOT Sent: %v, %v", r.GetSuccess(), err)
	} else {
		log.Printf("PNChatMessage Sent: %v", r.GetSuccess())
	}
}

// ConnectNotificationsEmailAdmin Connect to the notifications server and send email to admin
func ConnectNotificationsEmailAdmin(subject string, text string) {
	conn, c := connectNotificationsEmail()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	email := &pb.EmailAdminRequest{
		Subject: subject,
		Text:    text,
	}

	r, err := c.EmailAdmin(ctx, email)
	if err != nil {
		log.Printf("EmailAdmin NOT Sent: %v, %v", r.GetSuccess(), err)
	} else {
		log.Printf("EmailAdmin Sent: %v", r.GetSuccess())
	}
}
