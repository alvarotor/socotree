package models

// User is the model for the user table
type User struct {
	Base
	Email         string `gorm:"unique_index;not null;"`
	Password      string `gorm:"not null;"`
	Created       string `gorm:"-"` // ignore this field
	Updated       string `gorm:"-"` // ignore this field
	UserID        string `gorm:"-"` // ignore this field
	Profile       Profile
	UserInterest  []UserInterest
	BlockedUsers  []BlockedUsers `gorm:"foreignKey:UserBlockerID"`
	RecoveryCode  int32          `gorm:"not null;default:0"`
	EmailVerified bool
}
