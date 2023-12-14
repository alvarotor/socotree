package notifications

import (
	"log"

	"github.com/socotree/backend-notifications-circles-app/mail"
)

//MailNewCircleSend is the method to send emails to users about a new circle
func MailNewCircleSend(email string, name string) error {
	if err := mail.Send(
		mail.To(name, email),
		mail.Title("You’ve got matched for your event! 🎉🎊"),
		mail.FromEmail("hi@getcircles.com"),
		mail.FromName("Circles App"),
		mail.Template(
			"new_circle",
			mail.Content{},
		),
	); err != nil {
		log.Printf("Could not send new circle email: %s", err.Error())
		return err
	}
	log.Printf("Sent new circle email")
	return nil
}
