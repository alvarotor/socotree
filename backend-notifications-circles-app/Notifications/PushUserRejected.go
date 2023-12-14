package notifications

import (
	"log"
)

//PushUserRejected is the method to send push notification to users when they are admin rejected
func PNUserRejected(message string, token string) int {
	log.Printf("Sending user admin rejected PN...")
	fail := SendPushNotification(
		"Please, update your profile to use CIRCLES:",
		message,
		[]string{token},
		map[string]string{},
	)
	if fail > 0 {
		log.Println("Push Notification:", fail, "failed to be sent.")
		return fail
	}
	log.Printf("Sent user admin rejected PN")
	return 0
}
