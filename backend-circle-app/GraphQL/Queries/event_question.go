package qs

import (
	"errors"

	"github.com/graphql-go/graphql"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetQuestionsByEventIDQuery Get Question by Event id
func GetQuestionsByEventIDQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.EventQuestionType("ByID")),
		Description: "Get Question by Event id",
		Args: graphql.FieldConfigArgument{
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("GetQuestionsByEventIDQuery", "free aceess", "eventQuestions")

			eventid, ok := p.Args["eventid"].(string)
			if !ok {
				return nil, errors.New("must provide eventid")
			}

			model, err := dal.ReadEventQuestions(eventid)
			if err != nil {
				return nil, err
			}
			for key, value := range model {
				model[key].UUID = value.ID.String()
			}
			return model, nil
		},
	}
}
