package notifications

import (
	"log"
	"os"

	"gopkg.in/maddevsio/fcm.v1"
)

// SendPushNotification Send Push Notification
func SendPushNotification(title string, body string, tokens []string, data map[string]string) int {
	c := fcm.NewFCM(os.Getenv("FCMKEY"))
	response, err := c.Send(fcm.Message{
		Data:             data,
		RegistrationIDs:  tokens,
		ContentAvailable: true,
		Priority:         fcm.PriorityHigh,
		Notification: fcm.Notification{
			Title: title,
			Body:  body,
		},
	})
	if err != nil {
		log.Fatalf("error NewFCM: %v", err)
	}

	log.Println("Status Code   :", response.StatusCode)
	log.Println("Success       :", response.Success)
	log.Println("Fail          :", response.Fail)
	log.Println("Canonical_ids :", response.CanonicalIDs)
	log.Println("Topic MsgId   :", response.MsgID)

	return response.Fail
}
