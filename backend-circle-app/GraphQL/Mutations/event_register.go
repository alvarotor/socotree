package muts

import (
	"errors"
	"log"

	uuid "github.com/satori/go.uuid"
	utils "github.com/socotree/backend-circle-app/Utils"

	"github.com/graphql-go/graphql"
	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
)

//SetUserToEventRegister Add User To Event Register
func SetUserToEventRegister() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Register user to a Event",
		Args: graphql.FieldConfigArgument{
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("SetUserToEventRegister", userDecoded.ID, "setUserEventRegister")

			val, ok := p.Args["eventid"]
			if !ok {
				return false, errors.New("Eventid cant be empty")
			}

			eventID := val.(string)
			if len(eventID) == 0 {
				return false, errors.New("Eventid cant be empty")
			}

			eventUUID, err := uuid.FromString(eventID)
			if err != nil {
				return false, err
			}
			_, err = dal.ReadEvent(&eventUUID)
			if err != nil {
				return false, errors.New("Error reading event or it does not exist")
			}

			userID, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return false, err
			}
			users, err := dal.ReadEventRegistered(&eventUUID, &userID)
			if err != nil {
				return false, err
			}
			// todo check if time is good for registering

			for _, user := range users {

				if user.UserID.String() == userDecoded.ID {

					err = dal.DeleteUserInEventRegister(&eventUUID, &userID)
					if err != nil {
						return false, err
					}
					log.Println("delete")
					return true, nil

				}
			}

			eventRegister := models.EventRegister{
				EventID: eventUUID,
				UserID:  userID,
			}
			err = dal.AddEventRegister(&eventRegister)
			if err != nil {
				return false, err
			}
			log.Println("add user to register")

			return true, nil
		},
	}
}
