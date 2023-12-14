package models

import uuid "github.com/satori/go.uuid"

// UserInterest is the model for the user_interest table
type UserInterest struct {
	Base
	UserID     uuid.UUID `gorm:"index;type:uuid;not null;"`
	InterestID uuid.UUID `gorm:"index;type:uuid;not null;"`
	Interest   Interest
}
