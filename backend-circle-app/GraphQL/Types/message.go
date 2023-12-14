package types

import (
	"github.com/graphql-go/graphql"
)

//MessageType Message type is the graphql type for the message query
func MessageType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "MessageType" + name,
			Fields: graphql.Fields{
				"circleid": &graphql.Field{
					Type: graphql.String,
				},
				"userid": &graphql.Field{
					Type: graphql.String,
				},
				"user": &graphql.Field{
					Type: UserListType(name + "Message"),
				},
				"message": &graphql.Field{
					Type: graphql.String,
				},
				"created": &graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)
}
