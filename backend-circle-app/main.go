package main

import (
	"fmt"

	dal "github.com/socotree/backend-circle-app/DAL"
	graphql "github.com/socotree/backend-circle-app/GraphQL"
	utils "github.com/socotree/backend-circle-app/Utils"
	"github.com/socotree/backend-circle-app/grpc"
)

func init() {
	fmt.Println("INITIATING Backend")
	// dal.ResetTablesMigration()
	dal.InitialMigration()
}

func main() {
	SQL()
	utils.SegmentSystemStarts()

	go func() {
		grpc.Serve()
	}()

	graphql.Serve()
}
