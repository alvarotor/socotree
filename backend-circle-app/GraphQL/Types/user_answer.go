package types

import (
	"github.com/graphql-go/graphql"
)

//UserAnswerType User answer type is the graphql type for the user answers
func UserAnswerType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "UserAnswerType" + name,
			Fields: graphql.Fields{
				"questionid": &graphql.Field{
					Type: graphql.String,
				},
				"answerid": &graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)
}
