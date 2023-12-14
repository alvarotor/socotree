package qs

import (
	"errors"
	"time"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetAllUsersQuery Get All Users Query
func GetAllUsersQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.UserListType("")),
		Description: "Get all Users",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("user not authenticated or not enough permissions")
			}
			utils.SegmentPage("GetAllUsersQuery", "admin", "usersByAdmin")

			users, err := dal.ReadUsersWithProfileInterests()
			if err != nil {
				return nil, err
			}

			for key, value := range users {
				users[key].UserID = value.ID.String()
				users[key].Created = value.CreatedAt.Format(time.RFC3339)
				users[key].Updated = value.UpdatedAt.Format(time.RFC3339)
				users[key].Profile.Updated = value.Profile.UpdatedAt.Format(time.RFC3339)
			}

			return users, nil
		},
	}
}

//GetUserQuery Get User Query
func GetUserQuery() *graphql.Field {
	return &graphql.Field{
		Type:        types.UserListType("User"),
		Description: "Get a single user by id on auth header token",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("GetUserQuery", userDecoded.ID, "user")

			return readUser("user", userDecoded.ID, p)
		},
	}
}

//GetUserByAdminQuery Get User By Admin Query
func GetUserByAdminQuery() *graphql.Field {
	return &graphql.Field{
		Type:        types.UserListType("ByAdmin"),
		Description: "Get a single user by admin and userid",
		Args: graphql.FieldConfigArgument{
			"userid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("user not authenticated or not enough permissions")
			}
			utils.SegmentPage("GetUserByAdminQuery", "admin", "userByAdmin")

			useruuid, ok := p.Args["userid"].(string)
			if !ok {
				return nil, errors.New("must provide userid")
			}

			user, err := readUser("userByAdmin", useruuid, p)
			if err != nil {
				return nil, err
			}

			return user, nil
		},
	}
}

//ExistUserQuery Check if an user email exists
func ExistUserQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Check if an user email exists",
		Args: graphql.FieldConfigArgument{
			"email": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("ExistUserQuery", "free access", "existUser")

			email, ok := p.Args["email"].(string)
			if !ok {
				return nil, errors.New("must provide email")
			}

			_, err := dal.ReadUserByEmail(&email)
			if err != nil {
				return false, err
			}
			return true, nil
		},
	}
}

func readUser(query string, id string, p graphql.ResolveParams) (user models.User, err error) {
	userid, err := uuid.FromString(id)
	if err != nil {
		return models.User{}, err
	}

	valuesQuery := getSelectedFields([]string{query}, p)

	if utils.ArrayContains(valuesQuery, "profile") && utils.ArrayContains(valuesQuery, "userinterest") && utils.ArrayContains(valuesQuery, "blockedusers") {
		user, err = dal.ReadUserWithProfileInterestsBlockedUsers(&userid)
	} else if utils.ArrayContains(valuesQuery, "profile") && utils.ArrayContains(valuesQuery, "userinterest") {
		user, err = dal.ReadUserWithProfileInterests(&userid)
	} else if utils.ArrayContains(valuesQuery, "profile") && utils.ArrayContains(valuesQuery, "blockedusers") {
		user, err = dal.ReadUserWithBlockedUsersProfile(&userid)
	} else if utils.ArrayContains(valuesQuery, "userinterest") && utils.ArrayContains(valuesQuery, "blockedusers") {
		user, err = dal.ReadUserWithBlockedUsersInterests(&userid)
	} else if utils.ArrayContains(valuesQuery, "blockedusers") {
		user, err = dal.ReadUserWithBlockedUsers(&userid)
	} else if utils.ArrayContains(valuesQuery, "userinterest") {
		user, err = dal.ReadUserWithInterests(&userid)
	} else if utils.ArrayContains(valuesQuery, "profile") {
		user, err = dal.ReadUserWithProfile(&userid)
	} else {
		user, err = dal.ReadUser(&userid)
	}
	if err != nil {
		return models.User{}, err
	}

	user.UserID = user.ID.String()
	user.Created = user.CreatedAt.Format(time.RFC3339)
	user.Updated = user.UpdatedAt.Format(time.RFC3339)

	utils.SegmentTrack("Read User", user.UserID)

	return user, nil
}
