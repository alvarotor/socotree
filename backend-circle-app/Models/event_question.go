package models

import uuid "github.com/satori/go.uuid"

// EventQuestion is the model for the Event Question table
type EventQuestion struct {
	Base
	EventID    uuid.UUID `gorm:"index;type:uuid;not null;"`
	QuestionID uuid.UUID `gorm:"index;type:uuid;not null;"`
	Question   Question
	UUID       string `gorm:"-"` // ignore this field
	HardFilter bool
}
