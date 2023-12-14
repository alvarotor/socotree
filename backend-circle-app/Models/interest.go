package models

// Interest is the model for the interest table
type Interest struct {
	Base
	Name          string `gorm:"not null;"`
	UUID          string
	AdminVerified bool
	Weight        float32
}
