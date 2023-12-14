package models

import uuid "github.com/satori/go.uuid"

// EventQuestionAnswerMatches is the model for the Event Question Answer Matches table
type EventQuestionAnswerMatches struct {
	Base
	EventAnswerID1 uuid.UUID `gorm:"index;type:uuid;not null;"`
	EventAnswerID2 uuid.UUID `gorm:"index;type:uuid;not null;"`
	Weight         float32
	UUID           string `gorm:"-"` // ignore this field
}
