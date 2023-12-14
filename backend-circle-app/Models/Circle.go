package models

import (
	uuid "github.com/satori/go.uuid"
)

// Circle is the model for the circle table
type Circle struct {
	Base
	CircleID       uuid.UUID `gorm:"index;type:uuid;not null;"`
	User           User
	UserID         uuid.UUID `gorm:"index;type:uuid;not null;"`
	Created        string    `gorm:"-"` // ignore this field
	NotifiedPN     bool
	NotifiedEmail  bool
	EventID        uuid.UUID `gorm:"type:uuid;"` // TODO set not null in the future when all circles have event
	Event          Event
	NumberMessages int `gorm:"-"` // ignore this field
}
