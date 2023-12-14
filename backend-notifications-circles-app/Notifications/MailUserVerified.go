package notifications

import (
	"log"

	"github.com/socotree/backend-notifications-circles-app/mail"
)

//MailUserVerified is the method to send an email to users when they are admin verified
func MailUserVerified(email string, name string) error {
	if err := mail.Send(
		mail.To(name, email),
		mail.Title("Welcome to Circles! You are verified :)"),
		mail.FromEmail("hi@getcircles.com"),
		mail.FromName("Circles App"),
		mail.Template(
			"user_verified",
			mail.Content{},
		),
	); err != nil {
		log.Printf("Could not send user verified email: %s", err.Error())
		return err
	}
	log.Printf("Sent new circle email")
	return nil
}
