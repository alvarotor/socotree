package models

import uuid "github.com/satori/go.uuid"

// EventTime is the model for the EventSchedule table
type EventTime struct {
	Base
	EventID uuid.UUID `gorm:"index;type:uuid;not null;"`
	Year    int       `gorm:"not null;"`
	Month   int       `gorm:"not null;"`
	Day     int       `gorm:"not null;"`
	Hour    int       `gorm:"not null;"`
	Minute  int       `gorm:"not null;"`
}

// EventSchedule is the model for the EventSchedule table DEPRECATE ASAP
type EventSchedule struct {
	Base
	EventID uuid.UUID `gorm:"index;type:uuid;not null;"`
	Year    int       `gorm:"not null;"`
	Month   int       `gorm:"not null;"`
	Day     int       `gorm:"not null;"`
	Hour    int       `gorm:"not null;"`
	Minute  int       `gorm:"not null;"`
}
