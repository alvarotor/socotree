package types

import (
	"github.com/graphql-go/graphql"
)

//QuestionType Question type is the graphql type for the question query model
func QuestionType(name string) *graphql.Object {
	// Need to be able to extend the name as the creation of the schema complains when name of type is repeated
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Question" + name,
			Fields: graphql.Fields{
				"uuid": &graphql.Field{
					Type: graphql.ID,
				},
				"question": &graphql.Field{
					Type: graphql.String,
				},
				"global": &graphql.Field{
					Type: graphql.Boolean,
				},
				"answers": &graphql.Field{
					Type: graphql.NewList(AnswerType(name + "Question")),
				},
			},
		})
}
