package types

import (
	"github.com/graphql-go/graphql"
)

//BlockedUsersType Users blocked type is the graphql type for the users blocked
func BlockedUsersType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "BlockedUsersType" + name,
			Fields: graphql.Fields{
				"userblockedid": &graphql.Field{
					Type: graphql.String,
				},
				"userblocked": &graphql.Field{
					Type: UserType(name + "Blocked"),
				},
			},
		},
	)
}
