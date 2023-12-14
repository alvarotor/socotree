package grpc

import (
	"context"
	"log"

	pb "github.com/socotree/backend-circle-app/grpc"

	"google.golang.org/grpc"
)

const (
	portCircles = "3111"
)

// connectCircles Connect to the circles server
func connectCircles() (*grpc.ClientConn, pb.ServicesEventsCirclesClient) {
	log.Printf("Trying to connect to the backend GRPC server from ticker system...")
	// Set up a connection to the server.
	conn, err := grpc.Dial("app:"+portCircles, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Failed to connect to grpc backend server: %v", err)
	}

	c := pb.NewServicesEventsCirclesClient(conn)

	return conn, c
}

// ConnectReadEventsCircles Connect to the circles server and get events circles
func ConnectReadEventsCircles() ([]*pb.ResponseEventCircle, error) {
	conn, c := connectCircles()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()
	params := &pb.ReadCirclesParams{}

	r, err := c.ReadEventsCircles(ctx, params)
	if err != nil {
		log.Printf("ReadEventsCircles NOT read: %v, %v", r.GetSuccess(), err)
		return nil, err
	}

	log.Printf("ReadEventsCircles read: %v", r.GetSuccess())
	return r.GetEventCircles(), nil
}

// ConnectReadEvents Connect to the circles server and get events
func ConnectReadEvents() ([]*pb.ResponseEvent, error) {
	conn, c := connectCircles()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()
	params := &pb.ReadCirclesParams{}

	r, err := c.ReadEvents(ctx, params)
	if err != nil {
		log.Printf("ReadEvents NOT read: %v, %v", r.GetSuccess(), err)
		return nil, err
	}

	log.Printf("ReadEvents read: %v", r.GetSuccess())
	return r.GetEvents(), nil
}

// ReadEventRegisteredUsers Connect to the circles server and get events
func ConnectReadEventRegisteredUsers(eventid string) ([]*pb.ResponseUser, error) {
	conn, c := connectCircles()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()
	params := &pb.ReadCirclesParams{}
	params.Eventid = eventid

	r, err := c.ReadEventRegisteredUsers(ctx, params)
	if err != nil {
		log.Printf("ReadEventRegisteredUsers NOT read: %v, %v", r.GetSuccess(), err)
		return nil, err
	}

	log.Printf("ReadEventRegisteredUsers read: %v", r.GetSuccess())
	return r.GetUsers(), nil
}
