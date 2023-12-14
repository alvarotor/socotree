package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddUserAnswer Add a new user answer
func AddUserAnswer(model *models.UserAnswer) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadUserAnswers Read all user answers
func ReadUserAnswers(id *uuid.UUID) (model []models.UserAnswer, err error) {
	if err = db.Where("user_id = ?", id).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find answers")
		}
	}
	return
}

// DeleteAllUserAnswers Delete all user answers
func DeleteAllUserAnswers(id *uuid.UUID) (err error) {
	if db := db.Where("user_id = ?", id).Delete(&models.UserAnswer{}); db.Error != nil {
		return db.Error
	}
	return nil
}

// DeleteAllUserAnswers Delete all user answers
func DeleteUserAnswer(userid string, questionid string) (err error) {
	if db := db.Where("user_id = ? AND question_id = ?", userid, questionid).Delete(&models.UserAnswer{}); db.Error != nil {
		return db.Error
	}
	return nil
}
