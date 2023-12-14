package main

import (
	"fmt"

	notifications "github.com/socotree/backend-notifications-circles-app/Notifications"
	"github.com/socotree/backend-notifications-circles-app/grpc"
)

func init() {
	fmt.Println("INITIATING Backend Notifications")
}

func main() {

	go func() {
		notifications.Run()
	}()

	grpc.Serve()
}
