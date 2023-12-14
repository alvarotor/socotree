package notifications

import (
	"log"

	"github.com/socotree/backend-notifications-circles-app/mail"
)

// MailVerifyUserEmail is the method to send emails to verify user email
func MailVerifyUserEmail(email string, code int32) error {
	if err := mail.Send(
		mail.To("New circles user", email),
		mail.Title("Welcome to Circles! Verify your email"),
		mail.FromEmail("hi@getcircles.com"),
		mail.FromName("Circles App"),
		mail.Template(
			"verify_email_address",
			mail.Content{
				VerifyCode: code,
			},
		),
	); err != nil {
		log.Printf("Could not send verify email: %s", err.Error())
		return err
	}
	log.Printf("Sent verify user email")
	return nil
}
