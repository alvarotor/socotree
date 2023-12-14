package types

import (
	"github.com/graphql-go/graphql"
)

//UpdatedVersionType Updater Version Type
func UpdatedVersionType() *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "UpdatedVersion",
			Fields: graphql.Fields{
				"androidbuild": &graphql.Field{
					Type: graphql.Int,
				},
				"iosbuild": &graphql.Field{
					Type: graphql.Int,
				},
				"androidbuildforced": &graphql.Field{
					Type: graphql.Int,
				},
				"iosbuildforced": &graphql.Field{
					Type: graphql.Int,
				},
			},
		})
}
