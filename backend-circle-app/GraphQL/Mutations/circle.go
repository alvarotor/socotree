package muts

import (
	"errors"
	"log"
	"strconv"
	"strings"
	"sync"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
	"github.com/socotree/backend-circle-app/grpc"
)

// CreateCircle Create circle and add users
func CreateCircle() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Create circle and add users",
		Args: graphql.FieldConfigArgument{
			"circleid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"users": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("Only admins can create circles")
			}
			utils.SegmentPage("CreateCircle", "admin", "createCircle")

			var circleIDstr string
			val, ok := p.Args["circleid"]
			if !ok {
				return false, errors.New("Circleid cant be empty")
			}

			circleIDstr = val.(string)
			if len(strings.TrimSpace(circleIDstr)) == 0 {
				return false, errors.New("CircleId cant be empty")
			}

			var eventIDstr string
			val, ok = p.Args["eventid"]
			if !ok {
				return false, errors.New("Eventid cant be empty")
			}

			eventIDstr = val.(string)
			if len(strings.TrimSpace(circleIDstr)) == 0 {
				return false, errors.New("CircleId cant be empty")
			}

			valUsers, ok := p.Args["users"]
			if !ok {
				return false, errors.New("Must provide what users will belong to the circle")
			}
			usersNew := strings.Split(valUsers.(string), ",")
			usersNewLen := len(usersNew)
			if usersNewLen == 0 {
				return false, errors.New("Must provide users")
			}

			var circleID uuid.UUID
			sendEmailChn := make(chan models.User, usersNewLen)
			sendPNChn := make(chan models.User, usersNewLen)
			var wg sync.WaitGroup

			go NotifyEmail(sendEmailChn, &wg)
			go NotifyPN(sendPNChn, &wg)

			if circleIDstr != "new" {

				circleRead, err := dal.ReadCircle(circleIDstr)
				if err != nil {
					return false, err
				}
				if len(circleRead) == 0 {
					return false, errors.New("Cant find that circle")
				}

				log.Println("Adding new users to circle " + circleIDstr)
				for _, user := range usersNew {
					found := false
					for _, userCircle := range circleRead {
						if userCircle.UserID.String() == user {
							found = true
							break
						}
					}
					if !found {
						if _, err := addUserToCircle(user, circleID, sendEmailChn, sendPNChn, &wg, eventIDstr); err != nil {
							return false, err
						}
					} else {
						return false, errors.New("User already exist on that circle")
					}
				}

			} else {
				log.Println("Creating a new circle")
				circleID = uuid.NewV4()
				for _, user := range usersNew {
					if _, err := addUserToCircle(user, circleID, sendEmailChn, sendPNChn, &wg, eventIDstr); err != nil {
						return false, err
					}
				}
			}

			wg.Wait()
			close(sendEmailChn)
			close(sendPNChn)
			log.Println("Circle created")

			users := make(map[string]interface{})
			for i, u := range usersNew {
				key := []string{"userid-", strconv.Itoa(i)}
				users[strings.Join(key, " ")] = u
			}
			utils.SegmentGroup(circleID.String(), users)

			return true, nil
		},
	}
}

//NotifyEmail Notify user by Email
func NotifyEmail(sendEmail chan models.User, wg *sync.WaitGroup) {
	for u := range sendEmail {
		log.Println("Received channel notify email for", u.Profile.Name)
		if u.Profile.EmailsSwitch {
			log.Println("Sending user " + u.Profile.Name + " email about new circle")
			if grpc.ConnectNotificationsUserNewCircleEmail(u.Email, u.Profile.Name, u.ID.String()) {
				//using the user password to store the circle id
				log.Println("Setting user " + u.Profile.Name + " notified email")
				dal.NotifiedEmailCircleUpdate(u.Password, u.ID.String())
			}
		} else {
			log.Println(u.Profile.Name + " EmailsSwitch is off")
		}
		log.Println("Received channel notify email for", u.Profile.Name, "done")
		wg.Done()
	}
}

//NotifyPN Notify user by PN
func NotifyPN(sendPN chan models.User, wg *sync.WaitGroup) {
	for u := range sendPN {
		log.Println("Received channel notify pn for", u.Profile.Name)
		if u.Profile.PushNotificationSwitch && u.Profile.Logged && len(u.Profile.FcmToken) > 0 {
			log.Println("Sending user " + u.Profile.Name + " PN about new circle")
			//using the user password to store the circle id
			if grpc.ConnectNotificationsUserNewCirclePN(u.Password, u.Profile.FcmToken, u.ID.String(), u.Email) {
				log.Println("Setting user " + u.Profile.Name + " notified pn")
				dal.NotifiedPNCircleUpdate(u.Password, u.ID.String())
			}
		} else {
			log.Println(u.Profile.Name + " PushNotificationSwitch is off")
		}
		log.Println("Received channel notify pn for", u.Profile.Name, "done")
		wg.Done()
	}
}

//NotifyMessageChatPN Notify message chat user by PN
func NotifyMessageChatPN(circleid string, message string, sendPN chan models.User, wg *sync.WaitGroup) {
	for u := range sendPN {
		log.Println("Received channel notify pn for message", u.Profile.Name)
		if u.Profile.PushNotificationSwitch && u.Profile.Logged && len(u.Profile.FcmToken) > 0 {
			log.Println("Sending user " + u.Profile.Name + " PN about new message")
			//password has the message
			title := "Circles:"
			go grpc.ConnectNotificationsChats(title, message, u.ID.String(), circleid, []string{u.Profile.FcmToken})
		} else {
			log.Println(u.Profile.Name + " PushNotificationSwitch is off")
		}
		log.Println("Received channel notify pn for", u.Profile.Name, "done")
		wg.Done()
	}
}

func addUserToCircle(user string, circleID uuid.UUID, sendEmail chan models.User, sendPN chan models.User, wg *sync.WaitGroup, eventid string) (bool, error) {
	log.Println("Adding user " + user + " to the circle " + circleID.String())
	userID, err := uuid.FromString(user)
	if err != nil {
		return false, err
	}
	eventID, err := uuid.FromString(eventid)
	if err != nil {
		return false, err
	}
	circle := &models.Circle{
		CircleID: circleID,
		EventID:  eventID,
		UserID:   userID,
	}

	err = dal.AddUserToCircle(circle)
	if err != nil {
		return false, err
	}
	// err = dal.UpdateLastCircleDate(&user)
	// if err != nil {
	// 	return false, err
	// }
	userProf, err := dal.ReadUserWithProfile(&userID)
	if err != nil {
		return false, err
	}
	userProf.Password = circleID.String() // stored here to user the circle id in the notification
	log.Println("Added user " + user + " to the circle " + circleID.String())

	wg.Add(2)
	sendEmail <- userProf
	sendPN <- userProf

	return true, nil
}

// DeleteUserInCircle Delete user from a circle
func DeleteUserInCircle() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete user from a circle",
		Args: graphql.FieldConfigArgument{
			"circleId": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("DeleteUserInCircle", userDecoded.ID, "deleteUserInCircle")

			if val, ok := p.Args["circleId"]; ok {
				circleID := val.(string)
				if len(circleID) == 0 {
					return false, errors.New("CircleId cant be empty")
				}
				circleUUID, err := uuid.FromString(circleID)
				if err != nil {
					return false, err
				}
				userUUID, err := uuid.FromString(userDecoded.ID)
				if err != nil {
					return false, err
				}
				err = dal.DeleteUserInCircle(&circleUUID, &userUUID)
				if err != nil {
					return false, err
				}

				utils.SegmentTrack("Delete user from a circle "+circleID, userDecoded.ID)

				return true, nil
			}
			return false, errors.New("CircleId cant be empty")
		},
	}
}

//DeleteUserInCircleByAdmin Delete user from a circle by admin
func DeleteUserInCircleByAdmin() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete user from a circle by admin",
		Args: graphql.FieldConfigArgument{
			"circleId": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"user": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("Only admins can delete here users from circles")
			}
			utils.SegmentPage("DeleteUserInCircleByAdmin", "admin", "deleteUserInCircleByAdmin")

			user, ok := p.Args["user"]
			if !ok {
				return false, errors.New("Must provide what user will be deleted from the circle")
			}

			if val, ok := p.Args["circleId"]; ok {
				circleID := val.(string)
				if len(circleID) == 0 {
					return false, errors.New("CircleId cant be empty")
				}

				circleUUID, err := uuid.FromString(circleID)
				if err != nil {
					return false, err
				}
				userUUID, err := uuid.FromString(user.(string))
				if err != nil {
					return false, err
				}
				err = dal.DeleteUserInCircle(&circleUUID, &userUUID)
				if err != nil {
					return false, err
				}

				utils.SegmentTrack("Delete user from a circle by admin "+circleID, "admin")

				return true, nil
			}
			return false, errors.New("CircleId cant be empty")
		},
	}
}

//DeleteCircleByAdmin Delete circle by admin
func DeleteCircleByAdmin() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete circle by admin",
		Args: graphql.FieldConfigArgument{
			"circleId": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("Only admins can delete here users from circles")
			}
			utils.SegmentPage("DeleteCircleByAdmin", "admin", "deleteCircleByAdmin")

			if val, ok := p.Args["circleId"]; ok {
				circleID := val.(string)
				if len(circleID) == 0 {
					return false, errors.New("CircleId cant be empty")
				}

				circleUUID, err := uuid.FromString(circleID)
				if err != nil {
					return false, err
				}
				err = dal.DeleteCircle(&circleUUID)
				if err != nil {
					return false, err
				}

				utils.SegmentTrack("Delete circle by admin "+circleID, "admin")

				return true, nil
			}
			return false, errors.New("CircleId cant be empty")
		},
	}
}
