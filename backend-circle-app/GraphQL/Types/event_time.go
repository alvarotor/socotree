package types

import (
	"github.com/graphql-go/graphql"
)

//EventTimeType Event time type is the graphql type for the event query model
func EventTimeType(name string) *graphql.Object {
	// Need to be able to extend the name as the creation of the schema complains when name of type is repeated
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "EventTime" + name,
			Fields: graphql.Fields{
				"year": &graphql.Field{
					Type: graphql.Int,
				},
				"month": &graphql.Field{
					Type: graphql.Int,
				},
				"day": &graphql.Field{
					Type: graphql.Int,
				},
				"hour": &graphql.Field{
					Type: graphql.Int,
				},
				"minute": &graphql.Field{
					Type: graphql.Int,
				},
			},
		},
	)
}
