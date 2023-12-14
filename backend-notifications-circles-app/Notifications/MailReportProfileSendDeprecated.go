package notifications

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	m "github.com/keighl/mandrill"
	utils "github.com/socotree/backend-circle-app/Utils"
	models "github.com/socotree/backend-notifications-circles-app/Models"
)

//MailReportProfileSendDeprecated is the method to send emails to report users
func MailReportProfileSendDeprecated(w http.ResponseWriter, r *http.Request) {
	log.Printf("%v %v %v", r.RemoteAddr, r.ContentLength, r.Body)

	if (*r).Method != "POST" {
		log.Println("Error Wrong Method")
		http.Error(w, "Error Wrong Method", http.StatusBadRequest)
		return
	}

	user, err := utils.GetUserFromHeader(r.Header.Get("Authentication"))
	if err != nil {
		http.Error(w, "We need to get the user header data", http.StatusBadRequest)
		return
	}

	var b models.MailBody

	err = json.NewDecoder(r.Body).Decode(&b)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := m.ClientWithKey(os.Getenv("MANDRILL"))
	// client := m.ClientWithKey("SANDBOX_SUCCESS")
	// client := m.ClientWithKey("SANDBOX_ERROR")

	message := &m.Message{}
	message.AddRecipient("julian@socotree.io", "Julian", "to")
	message.AddRecipient("alvaro@socotree.io", "Alvaro", "to")
	message.FromEmail = "app@getcircles.com"
	message.FromName = "Circles App Reporter"
	message.Subject = "There is a report here"
	message.HTML = fmt.Sprintf("%s is reporting %s", user.ID, b.UserID)
	message.Text = fmt.Sprintf("%s is reporting %s", user.ID, b.UserID)

	res, err := client.MessagesSend(message)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	j, _ := json.Marshal(&models.Success{
		Success: true,
	})

	log.Println(res)
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
