package cache

import (
	"encoding/json"
	"time"

	models "github.com/socotree/backend-circle-app/Models"
)

func (cache *dbCache) Set(key string, value *[]models.User) {
	client := cache.getClient()
	json, err := json.Marshal(value)
	if err != nil {
		panic(err)
	}
	err = client.Set(ctx, key, json, cache.expires*time.Second).Err()
	if err != nil {
		panic(err)
	}
}

func (cache *dbCache) Get(key string) *[]models.User {
	client := cache.getClient()
	val, err := client.Get(ctx, key).Result()
	if err != nil {
		return nil
	}
	model := []models.User{}
	err = json.Unmarshal([]byte(val), &model)
	if err != nil {
		panic(err)
	}
	return &model
}
