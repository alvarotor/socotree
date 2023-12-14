package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddQuestionEvent Add a new event question
func AddQuestionEvent(model *models.EventQuestion) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// UpdateQuestionEvent Update a event question
func UpdateQuestionEvent(model *models.EventQuestion) (err error) {
	if db := db.Save(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadQuestionEvent Read a event question
func ReadQuestionEvent(id *uuid.UUID) (model models.EventQuestion, err error) {
	if err = db.Where("id = ?", id).Preload("Answers").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find question")
		}
	}
	return
}

// ReadQuestionsEvent Read all event questions
func ReadQuestionsEvent() (model []models.EventQuestion, err error) {
	if err := db.Preload("Answers").Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find questions")
		}
	}
	return
}

// DeleteQuestionEvent Delete a event question
func DeleteQuestionEvent(id *uuid.UUID) (err error) {
	if db := db.Where("id = ?", id).Delete(&models.EventQuestion{}); db.Error != nil {
		return db.Error
	}
	return nil
}

// AddQuestionAnswerMatch Add a new Question Answer Match
func AddQuestionAnswerMatch(model *models.EventQuestionAnswerMatches) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadQuestions Read all questions
func ReadQuestionAnswerMatches() (model []models.EventQuestionAnswerMatches, err error) {
	if err := db.Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find EventQuestionAnswerMatches")
		}
	}
	return
}

// DeleteQuestionAnswerMatch Delete a Question Answer Match
func DeleteQuestionAnswerMatch(id string) (err error) {
	if db := db.Where("id = ?", id).Delete(&models.EventQuestionAnswerMatches{}); db.Error != nil {
		return db.Error
	}
	return nil
}
