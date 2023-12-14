package qs

import (
	"errors"

	"github.com/graphql-go/graphql"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

func GetAllEventAnswersMatch() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.AnswerMatchType("")),
		Description: "Get all answers for match",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can use this method")
			}

			utils.SegmentPage("GetAllEventAnswersMatch", "admin", "getAllEventAnswersMatch")

			model, err := dal.ReadQuestionAnswerMatches()
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
