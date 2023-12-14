package models

import (
	uuid "github.com/satori/go.uuid"
)

// Profile is the model for the profile table
type Profile struct {
	Base
	Name                   string
	Photo                  string
	PhonePrefix            string
	Phone                  string
	AdminVerified          bool
	NewsUpdate             bool
	Admin                  bool
	AgeYear                int
	AgeMonth               int
	AgeDay                 int
	UserID                 uuid.UUID `gorm:"index;type:uuid;not null;"`
	FcmToken               string
	Profession             string
	District               int
	Login                  string
	AdminRejectedName      bool
	AdminRejectedDOB       bool
	AdminRejectedPhoto     bool
	AdminRejectedInterests bool
	AdminRejectedDistrict  bool
	AdminRejectedQuestions bool
	PushNotificationSwitch bool
	EmailsSwitch           bool
	Logged                 bool
	Platform               string
	Build                  int
	Updated                string `gorm:"-"` // ignore this field
	Lat                    float32
	Lon                    float32
}
