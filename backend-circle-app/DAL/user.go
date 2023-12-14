package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"

	models "github.com/socotree/backend-circle-app/Models"
	"github.com/socotree/backend-circle-app/cache"
)

var cacheUser cache.UserCacheInterface = cache.NewDbCache("redis:6379", 0, 60)

// AddUser Add a new user
func AddUser(model *models.User) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// AddProfile Add a new profile
func AddProfile(model *models.Profile) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadUser Read a user without its profile by id
func ReadUser(id *uuid.UUID) (model models.User, err error) {
	if err = db.Where("id = ?", id).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserWithProfile Read a user by id with its profile
func ReadUserWithProfile(id *uuid.UUID) (model models.User, err error) {
	if err = db.Where("id = ?", id).Preload("Profile").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserWithInterests Read a user by id with its interests
func ReadUserWithInterests(id *uuid.UUID) (model models.User, err error) {
	if err = db.Where("id = ?", id).Preload("UserInterest.Interest").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserWithBlockedUsers Read a user by id with its blocked users
func ReadUserWithBlockedUsers(id *uuid.UUID) (model models.User, err error) {
	if err = db.Where("id = ?", id).Preload("BlockedUsers.UserBlocked").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserWithProfileInterests Read a user by id with its interests and profile
func ReadUserWithProfileInterests(id *uuid.UUID) (model models.User, err error) {
	if err = db.Where("id = ?", id).Preload("UserInterest.Interest").Preload("Profile").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserWithBlockedUsersInterests Read a user by id with its interests and users blocked
func ReadUserWithBlockedUsersInterests(id *uuid.UUID) (model models.User, err error) {
	if err = db.Where("id = ?", id).Preload("UserInterest.Interest").Preload("BlockedUsers.UserBlocked").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserWithBlockedUsersProfile Read a user by id with its profile and users blocked
func ReadUserWithBlockedUsersProfile(id *uuid.UUID) (model models.User, err error) {
	if err = db.Where("id = ?", id).Preload("BlockedUsers.UserBlocked").Preload("Profile").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserWithProfileInterestsBlockedUsers Read a user by id with its interests, users blocked and profile
func ReadUserWithProfileInterestsBlockedUsers(id *uuid.UUID) (model models.User, err error) {
	if err = db.Where("id = ?", id).
		Preload("UserInterest.Interest").
		Preload("Profile").
		Preload("BlockedUsers.UserBlocked").
		First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserByEmailWithProfile Read a user with its profile by email
func ReadUserByEmailWithProfile(email *string) (model models.User, err error) {
	if err = db.Where("email = ?", email).Preload("Profile").First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserByEmail Read a user without its profile by email
func ReadUserByEmail(email *string) (model models.User, err error) {
	if err = db.Where("email = ?", email).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find user")
		}
	}
	return
}

// ReadUserByFPCode Read a user using forgot password code
func ReadUserByFPCode(code *string) (model models.User, err error) {
	if err = db.Where("recovery_code = ?", code).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("code does not exists")
		}
	}
	return
}

// ReadUsersWithProfileInterests Read all users with its profiles and interests
func ReadUsersWithProfileInterests() (model []models.User, err error) {
	var modelCache *[]models.User = cacheUser.Get("users")
	if modelCache != nil {
		return *modelCache, nil
	}
	if err := db.Preload("Profile").
		Preload("UserInterest.Interest").
		Order("created_at desc").
		Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("unable to find users")
		}
	}
	cacheUser.Set("users", &model)
	return
}

// DeleteUser Delete a user
func DeleteUser(id *uuid.UUID) (err error) {
	if db := db.Unscoped().Where("user_id = ?", id).Delete(&models.EventJoin{}); db.Error != nil {
		return db.Error
	}
	if db := db.Unscoped().Where("user_id = ?", id).Delete(&models.EventRegister{}); db.Error != nil {
		return db.Error
	}
	if db := db.Unscoped().Where("user_id = ?", id).Delete(&models.Message{}); db.Error != nil {
		return db.Error
	}
	if db := db.Unscoped().Where("user_id = ?", id).Delete(&models.Circle{}); db.Error != nil {
		return db.Error
	}
	if db := db.Unscoped().Where("user_id = ?", id).Delete(&models.UserAnswer{}); db.Error != nil {
		return db.Error
	}
	if db := db.Unscoped().Where("user_id = ?", id).Delete(&models.UserInterest{}); db.Error != nil {
		return db.Error
	}
	if db := db.Unscoped().
		Where("user_blocker_id = ?", id).
		Or("user_blocked_id = ?", id).
		Delete(&models.BlockedUsers{}); db.Error != nil {
		return db.Error
	}
	if db := db.Unscoped().Where("user_id = ?", id).Delete(&models.Profile{}); db.Error != nil {
		return db.Error
	}
	if db := db.Unscoped().Where("id = ?", id).Delete(&models.User{}); db.Error != nil {
		return db.Error
	}
	return nil
}

// UpdateUser Update an user
func UpdateUser(model *models.User) (err error) {
	if db := db.Save(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// UpdateProfile Update a profile
func UpdateProfile(model *models.Profile) (err error) {
	if db := db.Save(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// AddBlockedProfile Add a blocked profile
func AddBlockedProfile(model *models.BlockedUsers) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// RemoveBlockedProfile Delete a blocked profile
func RemoveBlockedProfile(userid string, profile string) (err error) {
	if db.Where("user_id = ? AND user_blocked_id = ?", userid, profile).Delete(&models.BlockedUsers{}); db.Error != nil {
		return db.Error
	}
	return nil
}
