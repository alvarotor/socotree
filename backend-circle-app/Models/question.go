package models

// Question is the model for the question table
type Question struct {
	Base
	Question string `gorm:"not null;"`
	Answers  []Answer
	UUID     string `gorm:"-"` // ignore this field
	Weight   float32
	Global   bool
}
