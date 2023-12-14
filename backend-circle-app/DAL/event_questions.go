package dal

import (
	"errors"

	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddEventQuestion Add a new event question
func AddEventQuestion(model *models.EventQuestion) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadEventQuestions Read all event questions
func ReadEventQuestions(id string) (model []models.EventQuestion, err error) {
	if err := db.Where("event_id = ?", id).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find event questions")
		}
	}
	return
}

// DeleteEventQuestion Delete an event question
func DeleteEventQuestion(id string) (err error) {
	if db := db.Where("id = ?", id).Delete(&models.EventQuestion{}); db.Error != nil {
		return db.Error
	}
	return nil
}
