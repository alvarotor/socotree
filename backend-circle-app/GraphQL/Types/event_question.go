package types

import (
	"github.com/graphql-go/graphql"
)

//EventQuestionType Event Question type is the graphql type for the event question query model
func EventQuestionType(name string) *graphql.Object {
	// Need to be able to extend the name as the creation of the schema complains when name of type is repeated
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "EventQuestion" + name,
			Fields: graphql.Fields{
				"uuid": &graphql.Field{
					Type: graphql.ID,
				},
				"questionid": &graphql.Field{
					Type: graphql.String,
				},
				"question": &graphql.Field{
					Type: QuestionType("Question" + name),
				},
				"eventid": &graphql.Field{
					Type: graphql.String,
				},
				"hardfilter": &graphql.Field{
					Type: graphql.Boolean,
				},
			},
		})
}
