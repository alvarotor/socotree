package types

import (
	"github.com/graphql-go/graphql"
)

//InterestType Interest type is the graphql type for the interest query model
func InterestType(name string) *graphql.Object {
	// Need to be able to extend the name as the creation of the schema complains when name of type is repeated
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Interest" + name,
			Fields: graphql.Fields{
				"uuid": &graphql.Field{
					Type: graphql.ID,
				},
				"name": &graphql.Field{
					Type: graphql.String,
				},
				"adminverified": &graphql.Field{
					Type: graphql.Boolean,
				},
				"weight": &graphql.Field{
					Type: graphql.Float,
				},
			},
		})
}
