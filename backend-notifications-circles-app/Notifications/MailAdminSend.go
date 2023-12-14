package notifications

import (
	"fmt"
	"log"
	"os"

	m "github.com/keighl/mandrill"
)

//MailAdminSend is the method to send emails to report users
func MailAdminSend(subject string, text string) error {
	client := m.ClientWithKey(os.Getenv("MANDRILL"))
	// client := m.ClientWithKey("SANDBOX_SUCCESS")
	// client := m.ClientWithKey("SANDBOX_ERROR")

	log.Println(fmt.Sprintf("%s = %s", subject, text))

	message := &m.Message{}
	message.AddRecipient("julian@socotree.io", "Julian", "to")
	message.AddRecipient("alvaro@socotree.io", "Alvaro", "to")
	message.FromEmail = "hi@getcircles.com"
	message.FromName = subject + " - " + os.Getenv("HOST")
	message.Subject = subject
	message.HTML = text
	message.Text = text

	res, err := client.MessagesSend(message)
	if err != nil {
		log.Println(err.Error())
		return err
	}
	log.Println(res)
	return nil
}
