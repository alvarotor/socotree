package models

import uuid "github.com/satori/go.uuid"

// BlockedUsers is the model for the users_blocked table
type BlockedUsers struct {
	Base
	UserBlockerID uuid.UUID `gorm:"index;type:uuid;not null;"`
	UserBlockedID uuid.UUID `gorm:"index;type:uuid;not null;"`
	UserBlocked   User
}

// BlockedUsers2 is the NEW model for the users_blocked table
type BlockedUsers2 struct {
	Base
	UserBlockerID uuid.UUID `gorm:"index;type:uuid;not null;"`
	UserBlockedID uuid.UUID `gorm:"index;type:uuid;not null;"`
	UserBlocked   User
}
