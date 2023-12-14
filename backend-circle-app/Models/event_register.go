package models

import uuid "github.com/satori/go.uuid"

// EventRegister is the model for the Event Register table
type EventRegister struct {
	Base
	EventID uuid.UUID `gorm:"index;type:uuid;not null;"`
	UserID  uuid.UUID `gorm:"index;type:uuid;not null;"`
	User    User
}
