package types

import (
	"github.com/graphql-go/graphql"
)

//EventJoinType EventJoin type is the graphql type for the EventJoin query
func EventJoinType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "EventJoinType" + name,
			Fields: graphql.Fields{
				"userid": &graphql.Field{
					Type: graphql.String,
				},
				"eventid": &graphql.Field{
					Type: graphql.String,
				},
				"user": &graphql.Field{
					Type: UserListType(name + "User"),
				},
			},
		},
	)
}
