package qs

import (
	"errors"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetAllQuestionsQuery Get all Questions
func GetAllQuestionsQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.QuestionType("")),
		Description: "Get all Questions",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("GetAllQuestionsQuery", "free access", "questions")

			questions, err := dal.ReadQuestions()
			if err != nil {
				return nil, err
			}
			for key, value := range questions {
				questions[key].UUID = value.ID.String()
				for keyAnswer, valueAnswer := range value.Answers {
					questions[key].Answers[keyAnswer].UUID = valueAnswer.ID.String()
				}
			}
			return questions, nil
		},
	}
}

//GetQuestionByIDQuery Get Question by id
func GetQuestionByIDQuery() *graphql.Field {
	return &graphql.Field{
		Type:        types.QuestionType("ByID"),
		Description: "Get Question by id",
		Args: graphql.FieldConfigArgument{
			"questionid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("GetQuestionByIDQuery", "GetQuestionByIDQuery", "question")

			questionid, ok := p.Args["questionid"].(string)
			if !ok {
				return nil, errors.New("must provide questionid")
			}
			questionuuid, err := uuid.FromString(questionid)
			if err != nil {
				return nil, err
			}
			question, err := dal.ReadQuestion(&questionuuid)
			if err != nil {
				return nil, err
			}
			question.UUID = question.ID.String()
			for keyAnswer, valueAnswer := range question.Answers {
				question.Answers[keyAnswer].UUID = valueAnswer.ID.String()
			}
			return question, nil
		},
	}
}
