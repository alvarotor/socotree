package muts

import (
	"errors"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

func CreateEventQuestion() *graphql.Field {
	return &graphql.Field{
		Type:        types.EventQuestionType("Create"),
		Description: "Create event question",
		Args: graphql.FieldConfigArgument{
			"questionid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"hardfilter": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Boolean),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can create questions")
			}
			utils.SegmentPage("CreateEventQuestion", "admin", "createEventQuestion")

			var questionid string
			if val, ok := p.Args["questionid"]; ok {
				questionid = val.(string)
			}
			var eventid string
			if val, ok := p.Args["eventid"]; ok {
				eventid = val.(string)
			}
			var hardfilter bool
			if val, ok := p.Args["hardfilter"]; ok {
				hardfilter = val.(bool)
			}
			uquestionid, err := uuid.FromString(questionid)
			if err != nil {
				return false, err
			}
			ueventid, err := uuid.FromString(eventid)
			if err != nil {
				return false, err
			}

			q := models.EventQuestion{
				QuestionID: uquestionid,
				EventID:    ueventid,
				HardFilter: hardfilter,
			}
			err = dal.AddEventQuestion(&q)
			if err != nil {
				return nil, err
			}

			q.UUID = q.ID.String()
			return q, nil
		},
	}
}

func DeleteEventQuestion() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete event question",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can delete questions")
			}

			utils.SegmentPage("DeleteQuestion", "admin", "deleteQuestion")

			var id string
			if val, ok := p.Args["id"]; ok {
				id = val.(string)
			}
			err := dal.DeleteEventQuestion(id)
			if err != nil {
				return nil, err
			}
			return true, nil
		},
	}
}
