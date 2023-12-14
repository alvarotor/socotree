package qs

import (
	"errors"
	"strings"

	"github.com/graphql-go/graphql"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
	"golang.org/x/crypto/bcrypt"
)

//LoginQuery Login users
func LoginQuery() *graphql.Field {
	return &graphql.Field{
		Type:        types.LoginTokenType(""),
		Description: "Get a token for authentication",
		Args: graphql.FieldConfigArgument{
			"email": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"password": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("LoginQuery", "free access", "login")

			email, ok := p.Args["email"].(string)
			if !ok {
				return nil, errors.New("Must provide email")
			}
			email = strings.ToLower(email)

			password, ok := p.Args["password"].(string)
			if !ok {
				return nil, errors.New("Must provide password")
			}

			user, err := dal.ReadUserByEmailWithProfile(&email)
			if err != nil {
				return nil, err
			}

			if !checkPassword(user.Password, password) {
				return nil, errors.New("Password incorrect")
			}

			token, err := utils.CreateToken(&user)
			if err != nil {
				return nil, errors.New("Creating token failed")
			}

			utils.SegmentTrack("Login", user.ID.String())

			return token, nil
		},
	}
}

// checkPassword Check is password is correct
func checkPassword(passwordDB string, password string) bool {
	passwordHash := []byte(password)
	passwordDBHash := []byte(passwordDB)
	err := bcrypt.CompareHashAndPassword(passwordDBHash, passwordHash)
	if err != nil {
		return false
	}
	return true
}
