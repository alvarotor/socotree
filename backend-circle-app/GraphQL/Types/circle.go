package types

import (
	"github.com/graphql-go/graphql"
)

//CircleType Circle type is the graphql type for the circle query
func CircleType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "CircleType" + name,
			Fields: graphql.Fields{
				"circleid": &graphql.Field{
					Type: graphql.String,
				},
				"eventid": &graphql.Field{
					Type: graphql.String,
				},
				"event": &graphql.Field{
					Type: EventType(name + "Circle"),
				},
				"userid": &graphql.Field{
					Type: graphql.String,
				},
				"user": &graphql.Field{
					Type: UserListType(name + "Circle"),
				},
				"created": &graphql.Field{
					Type: graphql.String,
				},
				"numbermessages": &graphql.Field{
					Type: graphql.Int,
				},
			},
		},
	)
}
