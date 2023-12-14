package qs

import (
	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetUserAnswersQuery Get user answers
func GetUserAnswersQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.UserAnswerType("")),
		Description: "Get user answers",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("GetUserAnswersQuery", userDecoded.ID, "readUserAnswers")

			userid, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return nil, err
			}
			answers, err := dal.ReadUserAnswers(&userid)
			if err != nil {
				return nil, err
			}
			return answers, nil
		},
	}
}
