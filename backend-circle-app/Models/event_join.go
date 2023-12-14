package models

import uuid "github.com/satori/go.uuid"

// Group is the model for the group table
type Group struct {
	Base
	EventID uuid.UUID `gorm:"index;type:uuid;not null;"`
	Event   Event
	UserID  uuid.UUID `gorm:"index;type:uuid;not null;"`
	User    User
}

// EventJoin is the model for the Event Join table
type EventJoin struct {
	Base
	EventID uuid.UUID `gorm:"index;type:uuid;not null;"`
	Event   Event
	UserID  uuid.UUID `gorm:"index;type:uuid;not null;"`
	User    User
}
