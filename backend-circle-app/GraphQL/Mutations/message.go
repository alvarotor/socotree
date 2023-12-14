package muts

import (
	"errors"
	"log"
	"sync"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//CreateMessage Create Message
func CreateMessage() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Create Message",
		Args: graphql.FieldConfigArgument{
			"circleid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"message": &graphql.ArgumentConfig{
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

			message, ok := p.Args["message"].(string)
			if !ok {
				return nil, errors.New("Must provide message")
			}

			if len(message) == 0 {
				return nil, errors.New("Must provide message")
			}

			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("CreateMessage", userDecoded.ID, "message")

			circleuuid, err := utils.UserBelongToCircle(circleid, userDecoded.ID)
			if err != nil {
				return nil, err
			}

			useruuid, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return nil, err
			}

			model := &models.Message{
				CircleID: circleuuid,
				UserID:   useruuid,
				Message:  message,
			}
			err = dal.AddMessage(model)
			if err != nil {
				return nil, err
			}

			log.Println("Message saved:", message)

			sendAllFcmCircle(userDecoded.ID, message, circleid)

			return true, nil
		},
	}
}

func sendAllFcmCircle(userid string, message string, circleuuid string) {
	uuID, err := uuid.FromString(userid)
	if err != nil {
		log.Println(err)
		return
	}

	sender, err := dal.ReadUserWithProfile(&uuID)
	if err != nil {
		log.Println(err)
		return
	}

	cChatters, err := dal.ReadCircle(circleuuid)
	if err != nil {
		log.Println(err)
		return
	}

	usersNewLen := len(cChatters)
	sendPNChn := make(chan models.User, usersNewLen)
	message = sender.Profile.Name + ": " + message
	var wg sync.WaitGroup
	go NotifyMessageChatPN(circleuuid, message, sendPNChn, &wg)

	for _, cChatter := range cChatters {
		cChatterProf, err := dal.ReadUserWithBlockedUsersProfile(&cChatter.UserID)
		if err != nil {
			log.Println(err)
		}

		if len(cChatterProf.Profile.FcmToken) == 0 {
			log.Println(cChatter.UserID.String() + " has no fcmToken")
		} else if cChatterProf.ID != sender.ID && cChatterProf.Profile.PushNotificationSwitch && cChatterProf.Profile.Logged {

			foundBlocked := false
			for _, blocked := range cChatterProf.BlockedUsers {
				if blocked.UserBlockedID == sender.ID {
					foundBlocked = true
					break // not send if its a blocked user.
				}
			}

			if foundBlocked {
				log.Println("Push Notification Not Sent (User blocked)")
				break
			}

			// Create the message to be sent.
			log.Println("Sending fcm tocken to server: " + cChatterProf.Profile.FcmToken)
			log.Println("Sender " + sender.Profile.Name + " -> " + cChatterProf.Profile.Name)
			log.Println("Sender " + sender.ID.String() + " -> " + cChatterProf.ID.String())

			wg.Add(1)
			sendPNChn <- cChatterProf

		} else {
			if cChatter.UserID == sender.ID {
				log.Println("Push Notification Not Sent (Same user)")
			} else {
				log.Println("Push Notification Not Sent (Logged) (PushNotificationSwitch):", cChatterProf.Profile.Logged, cChatterProf.Profile.PushNotificationSwitch)
			}
		}
	}

	wg.Wait()
	close(sendPNChn)
	log.Println("Message Notified")
}
