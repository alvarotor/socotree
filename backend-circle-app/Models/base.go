package models

import (
	"time"

	uuid "github.com/satori/go.uuid"

	"gorm.io/gorm"
)

// Base contains common columns for all tables
type Base struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

// BeforeCreate will set a UUID rather than numeric ID
func (base *Base) BeforeCreate(scope *gorm.DB) error {
	base.ID = uuid.NewV4()
	// if u.Role == "admin" {
	// 	return errors.New("invalid role")
	// }
	return nil
}
