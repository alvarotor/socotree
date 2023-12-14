package types

import (
	"github.com/graphql-go/graphql"
)

//UserInterestType User interest type is the graphql type for the user interests
func UserInterestType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "UserInterestType" + name,
			Fields: graphql.Fields{
				"interestid": &graphql.Field{
					Type: graphql.String,
				},
				"interest": &graphql.Field{
					Type: InterestType(name),
				},
			},
		},
	)
}
