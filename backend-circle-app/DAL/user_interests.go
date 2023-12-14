package dal

import (
	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
)

// AddUserInterests Add a new user interest
func AddUserInterests(model *models.UserInterest) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// DeleteAllUserInterests Delete all user interests
func DeleteAllUserInterests(id *uuid.UUID) (err error) {
	if db := db.Where("user_id = ?", id).Delete(&models.UserInterest{}); db.Error != nil {
		return db.Error
	}
	return nil
}
