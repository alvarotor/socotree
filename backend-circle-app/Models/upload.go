package models

// Upload is the model for the user picture
type Upload struct {
	Type   string `json:"type"`
	UserID string `json:"userID"`
	URI    string `json:"uri"`
	Data   string `json:"data"`
}
