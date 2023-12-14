package models

// Message is the model for the message table
type Message struct {
	Room    string `gorm:"not null;"`
	UserID  string `gorm:"not null;"`
	Message string `gorm:"not null;"`
}
