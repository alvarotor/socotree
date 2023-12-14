package notifications

import (
	"log"
)

//PushNewCircleSend is the method to send push notification to users when they are in a new circle
func PushNewCircleSend(eventid string, typepn string, tokens []string, eventname string) int {
	fail := SendPushNotification(
		"You are matched! 🎊",
		"Check out with who you got matched now!",
		tokens,
		map[string]string{
			"typepn":    typepn,
			"eventid":   eventid,
			"eventname": eventname,
		},
	)
	if fail > 0 {
		log.Println("Push Notification: ", fail, " failed to be sent.")
		return fail
	}
	log.Printf("Sent new circle PN")
	return 0
}
