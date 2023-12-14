package cache

import (
	"context"
	"time"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

type dbCache struct {
	host    string
	db      int
	expires time.Duration
}

func NewDbCache(host string, db int, expires time.Duration) UserCacheInterface {
	return &dbCache{
		host:    host,
		db:      db,
		expires: expires,
	}
}

func (cache *dbCache) getClient() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     cache.host,
		Password: "321654987",
		DB:       cache.db,
	})
}
