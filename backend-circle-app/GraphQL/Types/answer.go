package types

import (
	"github.com/graphql-go/graphql"
)

//AnswerType Answer type is the graphql type for the answer query model
func AnswerType(name string) *graphql.Object {
	// Need to be able to extend the name as the creation of the schema complains when name of type is repeated
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Answer" + name,
			Fields: graphql.Fields{
				"uuid": &graphql.Field{
					Type: graphql.ID,
				},
				"answer": &graphql.Field{
					Type: graphql.String,
				},
			},
		})
}

//AnswerMatchType Answer match type is the graphql type for the answer match query model
func AnswerMatchType(name string) *graphql.Object {
	// Need to be able to extend the name as the creation of the schema complains when name of type is repeated
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "AnswerMatch" + name,
			Fields: graphql.Fields{
				"uuid": &graphql.Field{
					Type: graphql.String,
				},
				"weight": &graphql.Field{
					Type: graphql.Float,
				},
				"eventanswerid1": &graphql.Field{
					Type: graphql.String,
				},
				"eventanswerid2": &graphql.Field{
					Type: graphql.String,
				},
			},
		})
}
