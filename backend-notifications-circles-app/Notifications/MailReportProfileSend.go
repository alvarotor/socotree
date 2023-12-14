package notifications

import (
	"fmt"
	"log"
	"os"

	m "github.com/keighl/mandrill"
)

//MailReportProfileSend is the method to send emails to report users
func MailReportProfileSend(
	NameReporter string, IDReporter string, NameReported string, IDReported string) error {
	client := m.ClientWithKey(os.Getenv("MANDRILL"))
	// client := m.ClientWithKey("SANDBOX_SUCCESS")
	// client := m.ClientWithKey("SANDBOX_ERROR")

	text := fmt.Sprintf("%s with id %s is reporting %s with id %s",
		NameReporter, IDReporter, NameReported, IDReported)

	message := &m.Message{}
	message.AddRecipient("julian@socotree.io", "Julian", "to")
	message.AddRecipient("alvaro@socotree.io", "Alvaro", "to")
	message.FromEmail = "app@getcircles.com"
	message.FromName = "Circles App Reporter - New Report - " + os.Getenv("HOST")
	message.Subject = "There is a report here"
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
