package types

import (
	"github.com/graphql-go/graphql"
)

//LoginTokenType Login email type is the graphql type for the login mutation
func LoginTokenType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "LoginToken" + name,
			Fields: graphql.Fields{
				"token": &graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)
}
