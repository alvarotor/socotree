package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddInterest Add a new insterest
func AddInterest(model *models.Interest) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// UpdateInterest Update a interest
func UpdateInterest(model *models.Interest) (err error) {
	if db := db.Save(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadInterests Read all interests
func ReadInterests() (model []models.Interest, err error) {
	if err := db.Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("Unable to find interests")
		}
	}
	return
}

// DeleteInterest Delete an insterest
func DeleteInterest(id *uuid.UUID) (err error) {
	if db := db.Where("id = ?", id).Delete(&models.Interest{}); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadInterest Read an interest
func ReadInterest(id *uuid.UUID) (model models.Interest, err error) {
	if err = db.Where("id = ?", id).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("Unable to find interest")
		}
	}
	return
}

// FindInterest Find an interest by name
func FindInterest(name string) (model models.Interest, err error) {
	if err = db.Where("name = ?", name).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("Unable to find interest")
		}
	}
	return
}
