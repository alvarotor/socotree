package muts

import (
	"errors"
	"log"
	"strings"

	uuid "github.com/satori/go.uuid"
	utils "github.com/socotree/backend-circle-app/Utils"

	"github.com/graphql-go/graphql"
	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
)

//SetUserToEventJoined Add User To Event Joined
func SetUserToEventJoined() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Join user to a Event",
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
			utils.SegmentPage("SetUserToEventJoined", userDecoded.ID, "setUserToEventJoined")

			val, ok := p.Args["eventid"]
			if !ok {
				return false, errors.New("eventid cant be empty")
			}

			eventID := val.(string)
			if len(eventID) == 0 {
				return false, errors.New("eventid cant be empty")
			}

			eventUUID, err := uuid.FromString(eventID)
			if err != nil {
				return false, err
			}

			_, err = dal.ReadEvent(&eventUUID) // event var off untill i decide to calculate the 3 hours
			if err != nil {
				return false, errors.New("error reading event or it does not exist")
			}

			userID, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return false, err
			}
			eventJoined, err := dal.ReadEventJoined(&eventUUID, &userID)
			if err != nil {
				return false, err
			}

			for _, user := range eventJoined {

				if user.UserID.String() == userDecoded.ID {

					err = dal.DeleteUserInEventJoined(&eventUUID, &userID)
					if err != nil {
						return false, err
					}
					log.Println("user prejoined deleted")
					return true, nil

				}
			}

			// if !lessThan3Hours(*event.EventTime) {
			// 	return false, errors.New("only can join 3 hours before the event")
			// }

			eventJoin := models.EventJoin{
				EventID: eventUUID,
				UserID:  userID,
			}
			err = dal.AddEventJoin(&eventJoin)
			if err != nil {
				return false, err
			}
			log.Println("user just joined")

			return true, nil
		},
	}
}

//SetUserToEventJoinedByAdmin Add User To Event Joined by admin
func SetUserToEventJoinedByAdmin() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Join user to a Event by admin",
		Args: graphql.FieldConfigArgument{
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"users": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("only admins can call this method")
			}
			utils.SegmentPage("SetUserToEventJoinedByAdmin", "admin", "setUserToEventJoinedByAdmin")

			val, ok := p.Args["eventid"]
			if !ok {
				return false, errors.New("eventid cant be empty")
			}

			eventID := val.(string)
			if len(eventID) == 0 {
				return false, errors.New("eventid cant be empty")
			}

			valUsers, ok := p.Args["users"]
			if !ok {
				return false, errors.New("must provide what users will belong to the event")
			}
			usersNew := strings.Split(valUsers.(string), ",")
			if len(usersNew) == 0 {
				return false, errors.New("must provide users")
			}

			eventUUID, err := uuid.FromString(eventID)
			if err != nil {
				return false, err
			}
			_, err = dal.ReadEvent(&eventUUID)
			if err != nil {
				return false, errors.New("error reading event or it does not exist")
			}

			for _, userIDstr := range usersNew {

				userID, err := uuid.FromString(userIDstr)
				if err != nil {
					return false, err
				}
				eventJoined, err := dal.ReadEventJoined(&eventUUID, &userID)
				if err != nil {
					return false, err
				}

				for _, user := range eventJoined {

					if user.UserID.String() == userIDstr {

						err = dal.DeleteUserInEventJoined(&eventUUID, &userID)
						if err != nil {
							return false, err
						}
						log.Println("delete")
						return true, nil

					}
				}

				eventJoin := models.EventJoin{
					EventID: eventUUID,
					UserID:  userID,
				}
				err = dal.AddEventJoin(&eventJoin)
				if err != nil {
					return false, err
				}
			}
			log.Println("users just joined by admin")

			return true, nil
		},
	}
}

// func lessThan3Hours(date models.EventTime) bool {
// 	// todo check if time is good for joining
// 	return true
// 	// return time.Date(date.Year, time.Month(date.Month), date.Day, date.Hour, date.Minute, 0, 0, time.UTC).
// 	// 	Add(-time.Duration(3) * time.Hour)
// }
