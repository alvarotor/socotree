package types

import (
	"github.com/graphql-go/graphql"
)

//UserType User type is the graphql type for the user create mutation
func UserType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "User" + name,
			Fields: graphql.Fields{
				"email": &graphql.Field{
					Type: graphql.String,
				},
				"password": &graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)
}

//UserListType User type is the graphql type for the user query model
func UserListType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "UserList" + name,
			Fields: graphql.Fields{
				"userid": &graphql.Field{
					Type: graphql.String,
				},
				"email": &graphql.Field{
					Type: graphql.String,
				},
				"created": &graphql.Field{
					Type: graphql.String,
				},
				"updated": &graphql.Field{
					Type: graphql.String,
				},
				"profile": &graphql.Field{
					Type: ProfileType(name),
				},
				"userinterest": &graphql.Field{
					Type: graphql.NewList(UserInterestType(name)),
				},
				"blockedusers": &graphql.Field{
					Type: graphql.NewList(BlockedUsersType(name)),
				},
				"emailverified": &graphql.Field{
					Type: graphql.Boolean,
				},
			},
		},
	)
}
