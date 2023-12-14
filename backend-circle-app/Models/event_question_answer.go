package models

import uuid "github.com/satori/go.uuid"

// EventQuestionAnswer is the model for the Event Question Answer table
type EventQuestionAnswer struct { // deprecate asap
	Base
	EventQuestionID uuid.UUID `gorm:"index;type:uuid;not null;"`
	Answer          string    `gorm:"not null;"`
}
