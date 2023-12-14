package models

// UpdatedVersion is the model for the update version
type UpdatedVersion struct {
	AndroidBuild       int `gorm:"not null;default:49"`
	IOSBuild           int `gorm:"not null;default:49"`
	AndroidBuildForced int `gorm:"not null;default:49"`
	IOSBuildForced     int `gorm:"not null;default:49"`
}
