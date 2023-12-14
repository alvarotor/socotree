package grpc

import (
	"fmt"
	"log"
	"net"
	"os"

	"google.golang.org/grpc"
)

const (
	portGRPC = ":811"
)

// Serve starts a new grpc server
func Serve() {
	env := os.Getenv("HOST")

	fmt.Println("Trying to listen tcp on port " + portGRPC)
	lis, err := net.Listen("tcp", portGRPC)
	if err != nil {
		log.Fatalf("Failed to listen tcp on port "+portGRPC+": %v", err)
	}

	grpcServer := grpc.NewServer()

	RegisterServicesEmailsServer(grpcServer, &ServerEmails{})
	RegisterServicesPushNotificationsServer(grpcServer, &ServerPushNotifications{})

	fmt.Println(fmt.Sprintf("Server Notifications gRPC started at tcp://%s"+portGRPC, env))
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve Notifications gRPC server over port "+portGRPC+": %v", err)
	}
}
