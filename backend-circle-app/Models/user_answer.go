package models

import uuid "github.com/satori/go.uuid"

// UserAnswer is the model for the user_answer table
type UserAnswer struct {
	Base
	UserID     uuid.UUID `gorm:"index;type:uuid;not null;"`
	QuestionID uuid.UUID `gorm:"index;type:uuid;not null;"`
	AnswerID   uuid.UUID `gorm:"index;type:uuid;not null;"`
}
