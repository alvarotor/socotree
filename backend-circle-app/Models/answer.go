package models

import uuid "github.com/satori/go.uuid"

// Answer is the model for the answer table
type Answer struct {
	Base
	QuestionID uuid.UUID `gorm:"index;type:uuid;not null;"`
	Answer     string    `gorm:"not null;"`
	UUID       string    `gorm:"-"` // ignore this field
}
