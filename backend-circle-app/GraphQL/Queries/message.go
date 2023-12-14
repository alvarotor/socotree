package qs

import (
	"errors"
	"time"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetMessagesQuery Get messages by circle id
func GetMessagesQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.MessageType("")),
		Description: "Get messages by circle id",
		Args: graphql.FieldConfigArgument{
			"circleid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			circleid, ok := p.Args["circleid"].(string)
			if !ok {
				return nil, errors.New("Must provide circleid")
			}

			if !utils.IsValidUUID(circleid) {
				return nil, errors.New("Must provide a valid circle id")
			}

			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("GetMessagesQuery", userDecoded.ID, "messages")

			circleuuid, err := utils.UserBelongToCircle(circleid, userDecoded.ID)
			if err != nil {
				return nil, err
			}

			messages, err := dal.ReadMessages(&circleuuid)
			if err != nil {
				return nil, err
			}

			for key, value := range messages {
				messages[key].Created = value.CreatedAt.Format(time.RFC3339)
			}

			utils.SegmentTrackMessagesCircle(userDecoded.ID, circleid)

			return messages, nil
		},
	}
}

//GetMessagesByAdminQuery Get messages by circle id for Admins
func GetMessagesByAdminQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.MessageType("ByAdmin")),
		Description: "Get messages by circle id for Admins",
		Args: graphql.FieldConfigArgument{
			"circleid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			circleid, ok := p.Args["circleid"].(string)
			if !ok {
				return nil, errors.New("Must provide circleid")
			}

			if !utils.IsValidUUID(circleid) {
				return nil, errors.New("Must provide a valid circle id")
			}

			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("Must be admin")
			}
			utils.SegmentPage("GetMessagesByAdminQuery", "admin", "messagesByAdmin")

			circleuuid, err := uuid.FromString(circleid)
			if err != nil {
				return nil, err
			}

			messages, err := dal.ReadMessages(&circleuuid)
			if err != nil {
				return nil, err
			}

			for key, value := range messages {
				messages[key].Created = value.CreatedAt.Format(time.RFC3339)
			}

			return messages, nil
		},
	}
}
