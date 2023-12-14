package muts

import (
	"errors"
	"log"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

func CreateQuestion() *graphql.Field {
	return &graphql.Field{
		Type:        types.QuestionType("Create"),
		Description: "Create question",
		Args: graphql.FieldConfigArgument{
			"question": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"global": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can create questions")
			}
			utils.SegmentPage("CreateQuestion", "admin", "createQuestion")

			var question string
			if val, ok := p.Args["question"]; ok {
				question = val.(string)
			}
			var global bool
			if val, ok := p.Args["global"]; ok {
				global = val.(bool)
			}
			q := models.Question{
				Question: question,
				Global:   global,
			}
			err := dal.AddQuestion(&q)
			if err != nil {
				return nil, err
			}
			q.UUID = q.ID.String()
			return q, nil
		},
	}
}

func CreateQuestionsAnswer() *graphql.Field {
	return &graphql.Field{
		Type:        types.QuestionType("CreateAnswer"),
		Description: "Create answer for question id",
		Args: graphql.FieldConfigArgument{
			"questionid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"answer": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can create answers")
			}
			utils.SegmentPage("CreateQuestionsAnswer", "admin", "createQuestionsAnswer")

			var questionstr string
			if val, ok := p.Args["questionid"]; ok {
				questionstr = val.(string)
			}
			var answerstr string
			if val, ok := p.Args["answer"]; ok {
				answerstr = val.(string)
			}
			questionID, err := uuid.FromString(questionstr)
			if err != nil {
				return false, err
			}
			question, err := dal.ReadQuestion(&questionID)
			if err != nil {
				return nil, err
			}
			answer := models.Answer{
				QuestionID: questionID,
				Answer:     answerstr,
			}
			err = dal.AddAnswer(&answer)
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

func DeleteQuestionsAnswer() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete answer for question id",
		Args: graphql.FieldConfigArgument{
			"answerid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can delete answers")
			}
			utils.SegmentPage("DeleteQuestionsAnswer", "admin", "deleteQuestionsAnswer")

			var answerstr string
			if val, ok := p.Args["answerid"]; ok {
				answerstr = val.(string)
			}
			answerID, err := uuid.FromString(answerstr)
			if err != nil {
				return false, err
			}
			err = dal.DeleteAnswer(&answerID)
			if err != nil {
				return nil, err
			}
			return true, nil
		},
	}
}

func DeleteQuestion() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete question",
		Args: graphql.FieldConfigArgument{
			"questionid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can delete questions")
			}
			utils.SegmentPage("DeleteQuestion", "admin", "deleteQuestion")

			var questionstr string
			if val, ok := p.Args["questionid"]; ok {
				questionstr = val.(string)
			}
			questionID, err := uuid.FromString(questionstr)
			if err != nil {
				return false, err
			}
			err = dal.DeleteQuestion(&questionID)
			if err != nil {
				return nil, err
			}
			return true, nil
		},
	}
}

func UpdateQuestionsAnswer() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Update answer for answer id",
		Args: graphql.FieldConfigArgument{
			"answerid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"answer": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can update questions")
			}
			utils.SegmentPage("UpdateQuestionsAnswer", "admin", "updateQuestionsAnswer")

			var answeridstr string
			if val, ok := p.Args["answerid"]; ok {
				answeridstr = val.(string)
			}
			var answerstr string
			if val, ok := p.Args["answer"]; ok {
				answerstr = val.(string)
			}
			answerID, err := uuid.FromString(answeridstr)
			if err != nil {
				return false, err
			}
			answer, err := dal.ReadAnswer(&answerID)
			if err != nil {
				return nil, err
			}
			log.Println(answerID.String())
			log.Println(answer)
			answer.Answer = answerstr
			log.Println(answer)
			err = dal.UpdateAnswer(&answer)
			if err != nil {
				return nil, err
			}
			return true, nil
		},
	}
}

func UpdateQuestion() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Update question",
		Args: graphql.FieldConfigArgument{
			"questionid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"question": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"global": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can update questions")
			}
			utils.SegmentPage("UpdateQuestion", "admin", "updateQuestion")

			var questionidstr string
			if val, ok := p.Args["questionid"]; ok {
				questionidstr = val.(string)
			}
			var questionstr string
			if val, ok := p.Args["question"]; ok {
				questionstr = val.(string)
			}
			var global bool
			if val, ok := p.Args["global"]; ok {
				global = val.(bool)
			}
			questionID, err := uuid.FromString(questionidstr)
			if err != nil {
				return false, err
			}
			question, err := dal.ReadQuestion(&questionID)
			if err != nil {
				return nil, err
			}
			question.Answers = nil //Answers updated later
			question.Question = questionstr
			question.Global = global
			err = dal.UpdateQuestion(&question)
			if err != nil {
				return nil, err
			}
			return true, nil
		},
	}
}
