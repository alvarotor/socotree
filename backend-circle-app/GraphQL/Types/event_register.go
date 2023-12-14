package types

import (
	"github.com/graphql-go/graphql"
)

//EventRegisterType EventRegister type is the graphql type for the EventRegister query
func EventRegisterType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "EventRegisterType" + name,
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
