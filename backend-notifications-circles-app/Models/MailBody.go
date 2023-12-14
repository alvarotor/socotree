package models

//MailBody String for the content to send on an email
type MailBody struct {
	UserID   string `json:"userid"`
	CircleID string `json:"circleid"`
}
