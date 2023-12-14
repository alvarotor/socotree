package cache

import models "github.com/socotree/backend-circle-app/Models"

type UserCacheInterface interface {
	Set(key string, value *[]models.User)
	Get(key string) *[]models.User
}
