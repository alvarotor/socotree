package notifications

import (
	"log"

	"github.com/socotree/backend-notifications-circles-app/mail"
)

// MailForgotPasswordUser is the method to send emails to verify user email
func MailForgotPasswordUser(email string, name string, code int32) error {
	if err := mail.Send(
		mail.To(name, email),
		mail.Title("Please reset your password"),
		mail.FromEmail("hi@getcircles.com"),
		mail.FromName("Circles App"),
		mail.Template(
			"forgot_password",
			mail.Content{
				VerifyCode: code,
			},
		),
	); err != nil {
		log.Printf("Could not send forgot password email: %s", err.Error())
		return err
	}
	log.Printf("Sent forgot password email")
	return nil
}
