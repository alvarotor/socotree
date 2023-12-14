package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"

	models "github.com/socotree/backend-circle-app/Models"
)

// AddMessage Add a new Message
func AddMessage(model *models.Message) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadMessages Read all Messages
func ReadMessages(circleid *uuid.UUID) (model []models.Message, err error) {
	if err := db.Preload("User.Profile").
		Order("created_at asc").Where("circle_id = ?", circleid).
		Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("Unable to find Messages")
		}
	}
	return
}
