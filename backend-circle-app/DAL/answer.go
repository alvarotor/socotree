package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddAnswer Add a new answer
func AddAnswer(model *models.Answer) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// UpdateAnswer Update an answer
func UpdateAnswer(model *models.Answer) (err error) {
	if db := db.Save(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadAnswer Read an answer
func ReadAnswer(id *uuid.UUID) (model models.Answer, err error) {
	if err = db.Where("id = ?", id).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find answer")
		}
	}
	return
}

// DeleteAnswer Delete a answer
func DeleteAnswer(id *uuid.UUID) (err error) {
	if db := db.Where("answer_id = ?", id).Delete(&models.UserAnswer{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("id = ?", id).Delete(&models.Answer{}); db.Error != nil {
		return db.Error
	}
	return nil
}
