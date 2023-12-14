package utils

import (
	"errors"
	"fmt"
	"os"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/mitchellh/mapstructure"
	models "github.com/socotree/backend-circle-app/Models"
)

var jwtSecret []byte = []byte(os.Getenv("JWTSECRET"))

//CreateToken Create a token to use it for future validations
func CreateToken(user *models.User) (models.Token, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    user.ID,
		"email": user.Email,
		"admin": user.Profile.Admin,
	})
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return models.Token{}, err
	}

	return models.Token{Token: tokenString}, nil
}

//validateJWT Validate the jwt token to indentify the user
func validateJWT(t string) (interface{}, error) {
	if t == "" || len(t) == 0 {
		return nil, errors.New("Authentication token must be present")
	}
	token, _ := jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("There was an error")
		}
		return jwtSecret, nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		var decodedToken models.TokenDecoded
		mapstructure.Decode(claims, &decodedToken)
		return decodedToken, nil
	}
	return nil, errors.New("Invalid authentication token")
}

//Authenticate Validate the jwt token and give it back as the token model
func Authenticate(token string) (models.TokenDecoded, error) {
	validated, err := validateJWT(token)
	if err != nil {
		return models.TokenDecoded{}, errors.New("Error validating token")
	}
	return validated.(models.TokenDecoded), nil
}

//GetUserFromHeader Get User From Header
func GetUserFromHeader(authStr string) (models.TokenDecoded, error) {
	if len(authStr) == 0 {
		return models.TokenDecoded{}, errors.New("Authentication header not found")
	}

	userDecoded, err := Authenticate(authStr)
	if err != nil {
		return models.TokenDecoded{}, err
	}
	return userDecoded, nil
}

//IsAdminFromHeader Is Admin user From Header
func IsAdminFromHeader(authStr string) bool {
	userDecoded, err := GetUserFromHeader(authStr)
	if err != nil {
		return false
	}
	if !userDecoded.Admin {
		return false
	}
	return true
}

//GetUserID Get User ID
func GetUserID(authentication string) (string, error) {
	authStr := authentication
	if len(authStr) == 0 {
		return "", errors.New("Authentication header not found")
	}

	userDecoded, err := Authenticate(authStr)
	if err != nil {
		return "", err
	}

	return userDecoded.ID, nil
}
