package models

import uuid "github.com/satori/go.uuid"

// Message is the model for the message table
type Message struct {
	Base
	CircleID uuid.UUID `gorm:"index;type:uuid;not null;"`
	UserID   uuid.UUID `gorm:"index;type:uuid;not null;"`
	User     User
	Message  string `gorm:"not null;"`
	Created  string `gorm:"-"` // ignore this field
}

// Message2 is the NEW model for the message table
type Message2 struct {
	Base
	CircleID uuid.UUID `gorm:"index;type:uuid;not null;"`
	UserID   uuid.UUID `gorm:"index;type:uuid;not null;"`
	User     User
	Message  string `gorm:"not null;"`
	Created  string `gorm:"-"` // ignore this field
}
