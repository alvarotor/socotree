package models

import uuid "github.com/satori/go.uuid"

// EventUserAnswer is the model for the Event User Answer table
type EventUserAnswer struct {
	Base
	UserID   uuid.UUID `gorm:"index;type:uuid;not null;"`
	AnswerID uuid.UUID `gorm:"index;type:uuid;not null;"`
}
