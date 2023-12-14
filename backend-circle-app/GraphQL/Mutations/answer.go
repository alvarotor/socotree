package muts

import (
	"encoding/json"
	"errors"
	"strings"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

func CreateUserAnswers() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Create user answers",
		Args: graphql.FieldConfigArgument{
			"answers": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecode, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("CreateUserAnswers", userDecode.ID, "createUserAnswers")

			var answers string
			if val, ok := p.Args["answers"]; ok {
				answers = val.(string)
			}
			answers = strings.ReplaceAll(answers, "'", "\"")
			rawIn := json.RawMessage(answers)
			bytes, err := rawIn.MarshalJSON()
			if err != nil {
				return nil, err
			}
			var uA []models.UserAnswer
			err = json.Unmarshal(bytes, &uA)
			if err != nil {
				return nil, err
			}
			userID, err := uuid.FromString(userDecode.ID)
			if err != nil {
				return nil, err
			}
			for _, a := range uA {
				a.UserID = userID
				if err = dal.DeleteUserAnswer(userID.String(), a.QuestionID.String()); err != nil {
					return nil, err
				}
				if err = dal.AddUserAnswer(&a); err != nil {
					return nil, err
				}
			}
			return true, nil
		},
	}
}

func DeleteUserAnswers() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete user answers",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecode, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("DeleteUserAnswers", userDecode.ID, "deleteUserAnswers")

			userID, err := uuid.FromString(userDecode.ID)
			if err != nil {
				return nil, err
			}
			if err = dal.DeleteAllUserAnswers(&userID); err != nil {
				return nil, err
			}
			return true, nil
		},
	}
}

// func DeleteUserAnswer() *graphql.Field {
// 	return &graphql.Field{
// 		Type:        graphql.Boolean,
// 		Description: "Delete user answers",
// 		Args: graphql.FieldConfigArgument{
// 			"question": &graphql.ArgumentConfig{
// 				Type: graphql.NewNonNull(graphql.String),
// 			},
// 		},
// 		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
// 			userDecode, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
// 			if err != nil {
// 				return nil, err
// 			}
// 			utils.SegmentPage("DeleteUserAnswer", userDecode.ID, "deleteUserAnswer")

// 			var question string
// 			if val, ok := p.Args["question"]; ok {
// 				question = val.(string)
// 			} else {
// 				return nil, errors.New("question argument value not valid or not found")
// 			}
// 			if err = dal.DeleteUserAnswer(userDecode.ID, question); err != nil {
// 				return nil, err
// 			}

// 			return true, nil
// 		},
// 	}
// }

func CreateEventAnswersMatch() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Create answers for match",
		Args: graphql.FieldConfigArgument{
			"eventanswerid1": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"eventanswerid2": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"weight": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Float),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can use this method")
			}

			utils.SegmentPage("CreateEventAnswersMatch", "admin", "createEventAnswersMatch")

			var eventanswerid1 string
			if val, ok := p.Args["eventanswerid1"]; ok {
				eventanswerid1 = val.(string)
			}

			var eventanswerid2 string
			if val, ok := p.Args["eventanswerid2"]; ok {
				eventanswerid2 = val.(string)
			}

			var weight float64
			if val, ok := p.Args["weight"]; ok {
				weight = val.(float64)
			}

			ueventanswerid1, err := uuid.FromString(eventanswerid1)
			if err != nil {
				return nil, err
			}

			ueventanswerid2, err := uuid.FromString(eventanswerid2)
			if err != nil {
				return nil, err
			}

			model := &models.EventQuestionAnswerMatches{
				Weight:         float32(weight),
				EventAnswerID1: ueventanswerid1,
				EventAnswerID2: ueventanswerid2,
			}

			err = dal.AddQuestionAnswerMatch(model)
			if err != nil {
				return nil, err
			}

			return true, nil
		},
	}
}

func DeleteEventAnswersMatch() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete answers for match",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can use this method")
			}

			utils.SegmentPage("DeleteEventAnswersMatch", "admin", "deleteEventAnswersMatch")

			var id string
			if val, ok := p.Args["id"]; ok {
				id = val.(string)
			}

			err := dal.DeleteQuestionAnswerMatch(id)
			if err != nil {
				return nil, err
			}

			return true, nil
		},
	}
}
