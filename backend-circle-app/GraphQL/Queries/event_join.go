package qs

import (
	"errors"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetEventJoinedByAdminQuery Get Event Joined by admin
func GetEventJoinedByAdminQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.EventJoinType("UsersJoin")),
		Description: "Get the Event Joined by event id",
		Args: graphql.FieldConfigArgument{
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("User not authenticated or not enough permissions")
			}
			eventid, ok := p.Args["eventid"].(string)
			if !ok {
				return nil, errors.New("Must provide eventid")
			}

			uuid, err := uuid.FromString(eventid)
			if err != nil {
				return nil, err
			}
			model, err := dal.ReadAllEventJoined(&uuid)
			if err != nil {
				return nil, err
			}

			return model, nil
		},
	}
}

//GetUserExistEventJoinedQuery Get Event Joined
func GetUserExistEventJoinedQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Get if user exists in the Event Joined",
		Args: graphql.FieldConfigArgument{
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			user, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, errors.New("User not authenticated or not enough permissions")
			}

			eventid, ok := p.Args["eventid"].(string)
			if !ok {
				return false, errors.New("Must provide eventid")
			}

			uueventid, err := uuid.FromString(eventid)
			if err != nil {
				return false, err
			}
			userid, err := uuid.FromString(user.ID)
			if err != nil {
				return false, err
			}

			eventAtendee, err := dal.ReadEventJoined(&uueventid, &userid)
			if err != nil {
				return false, err
			}

			return len(eventAtendee) > 0, nil
		},
	}
}
