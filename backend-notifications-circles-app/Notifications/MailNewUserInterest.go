package notifications

import (
	"fmt"
	"log"
	"os"

	m "github.com/keighl/mandrill"
)

//MailNewUserInterest is the method to send emails to admin about a new interest
func MailNewUserInterest(interest string) error {
	client := m.ClientWithKey(os.Getenv("MANDRILL"))
	// client := m.ClientWithKey("SANDBOX_SUCCESS")
	// client := m.ClientWithKey("SANDBOX_ERROR")

	message := &m.Message{}
	message.AddRecipient("julian@socotree.io", "Julian", "to")
	message.AddRecipient("alvaro@socotree.io", "Alvaro", "to")
	message.FromEmail = "app@getcircles.com"
	message.FromName = "Circles App Reporter - New Interests - " + os.Getenv("HOST")
	message.Subject = "A user added a new Interest!"
	message.HTML = fmt.Sprintf("<h1> %s </h1>", interest)
	message.Text = interest

	res, err := client.MessagesSend(message)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	log.Println("Email for admin interest sent", res)
	return nil
}
