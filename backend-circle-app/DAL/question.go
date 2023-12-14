package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddQuestion Add a new question
func AddQuestion(model *models.Question) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// UpdateQuestion Update a question
func UpdateQuestion(model *models.Question) (err error) {
	if db := db.Save(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadQuestion Read a question
func ReadQuestion(id *uuid.UUID) (model models.Question, err error) {
	if err = db.Where("id = ?", id).Preload("Answers").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find question")
		}
	}
	return
}

// ReadQuestions Read all questions
func ReadQuestions() (model []models.Question, err error) {
	if err := db.Preload("Answers").Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find questions")
		}
	}
	return
}

// DeleteQuestion Delete a question
func DeleteQuestion(id *uuid.UUID) (err error) {
	if db := db.Where("question_id = ?", id).Delete(&models.UserAnswer{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("question_id = ?", id).Delete(&models.Answer{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("id = ?", id).Delete(&models.Question{}); db.Error != nil {
		return db.Error
	}
	return nil
}
