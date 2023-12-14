package types

import (
	"github.com/graphql-go/graphql"
)

//EventType Event type is the graphql type for the event query model
func EventType(name string) *graphql.Object {
	// Need to be able to extend the name as the creation of the schema complains when name of type is repeated
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Event" + name,
			Fields: graphql.Fields{
				"uuid": &graphql.Field{
					Type: graphql.String,
				},
				"updated": &graphql.Field{
					Type: graphql.String,
				},
				"created": &graphql.Field{
					Type: graphql.String,
				},
				"picture": &graphql.Field{
					Type: graphql.String,
				},
				"name": &graphql.Field{
					Type: graphql.String,
				},
				"location": &graphql.Field{
					Type: graphql.String,
				},
				"description": &graphql.Field{
					Type: graphql.String,
				},
				"smalldescription": &graphql.Field{
					Type: graphql.String,
				},
				"eventtime": &graphql.Field{
					Type: EventTimeType(name),
				},
				"eventjoin": &graphql.Field{
					Type: graphql.NewList(EventJoinType(name + "EventJoined")),
				},
				"eventregister": &graphql.Field{
					Type: graphql.NewList(EventRegisterType(name + "EventRegistered")),
				},
				"addrestusers": &graphql.Field{
					Type: graphql.Boolean,
				},
				"recircle": &graphql.Field{
					Type: graphql.Boolean,
				},
				"circlesize": &graphql.Field{
					Type: graphql.Int,
				},
				"age": &graphql.Field{
					Type: graphql.Boolean,
				},
				"prematch": &graphql.Field{
					Type: graphql.Boolean,
				},
				"lang": &graphql.Field{
					Type: graphql.Boolean,
				},
				"notify": &graphql.Field{
					Type: graphql.Boolean,
				},
				"type": &graphql.Field{
					Type: graphql.Int,
				},
				"questionsweight": &graphql.Field{
					Type: graphql.Float,
				},
				"link": &graphql.Field{
					Type: graphql.String,
				},
				"eventquestion": &graphql.Field{
					Type: graphql.NewList(EventQuestionType(name + "EventQuestion")),
				},
			},
		},
	)
}
