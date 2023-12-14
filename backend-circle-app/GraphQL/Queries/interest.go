package qs

import (
	"errors"
	"log"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetAllInterestsQuery Get all Interests
func GetAllInterestsQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.InterestType("S")),
		Description: "Get all Interests",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("GetAllInterestsQuery", "free access", "interests")

			interests, err := dal.ReadInterests()
			if err != nil {
				return nil, err
			}
			for key, value := range interests {
				interests[key].UUID = value.ID.String()
			}
			return interests, nil
		},
	}
}

//GetInterestQuery Get Interest by id
func GetInterestQuery() *graphql.Field {
	return &graphql.Field{
		Type:        types.InterestType("Get"),
		Description: "Get Interest by id",
		Args: graphql.FieldConfigArgument{
			"interestid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("GetInterestQuery", "GetInterestQuery", "interest")

			interestid, ok := p.Args["interestid"].(string)
			if !ok {
				return nil, errors.New("Must provide interestid")
			}
			interestuuid, err := uuid.FromString(interestid)
			if err != nil {
				return nil, err
			}
			interest, err := dal.ReadInterest(&interestuuid)
			if err != nil {
				return nil, err
			}
			log.Println(interest)
			interest.UUID = interest.ID.String()

			return interest, nil
		},
	}
}
