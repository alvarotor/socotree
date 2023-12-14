package types

import (
	"github.com/graphql-go/graphql"
)

//ProfileType Profile type is the graphql type for the event query model
func ProfileType(name string) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Profile" + name,
			Fields: graphql.Fields{
				"profession": &graphql.Field{
					Type: graphql.String,
				},
				"district": &graphql.Field{
					Type: graphql.Int,
				},
				"login": &graphql.Field{
					Type: graphql.String,
				},
				"ageyear": &graphql.Field{
					Type: graphql.Int,
				},
				"agemonth": &graphql.Field{
					Type: graphql.Int,
				},
				"ageday": &graphql.Field{
					Type: graphql.Int,
				},
				"admin": &graphql.Field{
					Type: graphql.Boolean,
				},
				"name": &graphql.Field{
					Type: graphql.String,
				},
				"photo": &graphql.Field{
					Type: graphql.String,
				},
				"fcmtoken": &graphql.Field{
					Type: graphql.String,
				},
				"phone": &graphql.Field{
					Type: graphql.String,
				},
				"phoneprefix": &graphql.Field{
					Type: graphql.String,
				},
				"newsupdate": &graphql.Field{
					Type: graphql.Boolean,
				},
				"adminverified": &graphql.Field{
					Type: graphql.Boolean,
				},
				"adminrejectedname": &graphql.Field{
					Type: graphql.Boolean,
				},
				"adminrejecteddob": &graphql.Field{
					Type: graphql.Boolean,
				},
				"adminrejectedphoto": &graphql.Field{
					Type: graphql.Boolean,
				},
				"adminrejectedinterests": &graphql.Field{
					Type: graphql.Boolean,
				},
				"adminrejecteddistrict": &graphql.Field{
					Type: graphql.Boolean,
				},
				"adminrejectedquestions": &graphql.Field{
					Type: graphql.Boolean,
				},
				"pushnotificationswitch": &graphql.Field{
					Type: graphql.Boolean,
				},
				"logged": &graphql.Field{
					Type: graphql.Boolean,
				},
				"emailsswitch": &graphql.Field{
					Type: graphql.Boolean,
				},
				"platform": &graphql.Field{
					Type: graphql.String,
				},
				"build": &graphql.Field{
					Type: graphql.Int,
				},
				"updated": &graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)
}
