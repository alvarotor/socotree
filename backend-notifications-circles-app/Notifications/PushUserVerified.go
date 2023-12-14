package notifications

import (
	"log"
)

//PushUserVerified is the method to send push notification to users when they are admin verified
func PushUserVerified(tokens []string) int {
	log.Printf("Sending user admin verified PN...")
	fail := SendPushNotification(
		"Welcome to Circles!",
		"You are now a verified member :)",
		tokens,
		map[string]string{
			"typepn": "userverified",
		},
	)
	if fail > 0 {
		log.Println("Push Notification:", fail, "failed to be sent.")
		return fail
	}
	log.Printf("Sent user admin verified PN")
	return 0
}
