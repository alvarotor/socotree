package qs

import (
	"errors"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetEventRegisteredByAdminQuery Get Event Registered by admin
func GetEventRegisteredUsersByAdminQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.EventRegisterType("UsersRegister")),
		Description: "Get the Event Registered Users by event id",
		Args: graphql.FieldConfigArgument{
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("user not authenticated or not enough permissions")
			}
			eventid, ok := p.Args["eventid"].(string)
			if !ok {
				return nil, errors.New("must provide eventid")
			}

			model, err := dal.ReadAllEventRegisterUsers(eventid)
			if err != nil {
				return nil, err
			}

			return model, nil
		},
	}
}

//GetUserExistEventRegisteredQuery Get Event Registered
func GetUserExistEventRegisteredQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Get if user exists in the Event Registered",
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

			eventRegister, err := dal.ReadEventRegistered(&uueventid, &userid)
			if err != nil {
				return false, err
			}

			return len(eventRegister) > 0, nil
		},
	}
}

//GetUserRegisteredEventsQuery Get Events Registered by User
func GetUserRegisteredEventsQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.EventRegisterType("UsersRegisterByUser")),
		Description: "Get Events Registered by User",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			user, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, errors.New("User not authenticated or not enough permissions")
			}

			eventsRegister, err := dal.ReadEventsRegisteredByUser(user.ID)
			if err != nil {
				return false, err
			}

			return eventsRegister, nil
		},
	}
}
