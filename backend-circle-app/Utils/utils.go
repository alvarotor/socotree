package utils

import (
	"errors"
	"reflect"

	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
)

//IsValidUUID Checks for valid uuid variable
func IsValidUUID(u string) bool {
	_, err := uuid.FromString(u)
	return err == nil
}

//ArrayContains Find if an element is inside an array
func ArrayContains(arrayType interface{}, item interface{}) bool {
	arr := reflect.ValueOf(arrayType)

	if arr.Kind() != reflect.Slice && arr.Kind() != reflect.Array {
		panic("Invalid data-type")
	}

	for i := 0; i < arr.Len(); i++ {
		if arr.Index(i).Interface() == item {
			return true
		}
	}

	return false
}

//StringExistsInArray Find if an element is inside an string array
func StringExistsInArray(item string, array []string) bool {
	for _, value := range array {
		if value == item {
			return true
		}
	}
	return false
}

//UserBelongToCircle Find if an User Belong To a Circle
func UserBelongToCircle(circleid string, userid string) (uuid.UUID, error) {
	circleuuid, err := uuid.FromString(circleid)
	if err != nil {
		return uuid.UUID{}, err
	}

	if !IsValidUUID(circleid) {
		return uuid.UUID{}, errors.New("You must provide a valid id")
	}

	circle, err := dal.ReadCircle(circleid)
	if err != nil {
		return uuid.UUID{}, err
	}

	for _, users := range circle {
		if users.UserID.String() == userid {
			return circleuuid, nil
		}
	}

	return uuid.UUID{}, errors.New("User does not belong to this circle")
}
