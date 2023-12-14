package qs

import (
	"errors"
	"log"
	"time"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetCirclesByAdminQuery Get all Circles by admin
func GetCirclesByAdminQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.CircleType("ByAdmin")),
		Description: "Get all Circles by admin",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("user not authenticated or not enough permissions")
			}
			utils.SegmentPage("GetCirclesByAdminQuery", "admin", "circlesByAdmin")

			circles, err := dal.ReadCircles()
			if err != nil {
				return nil, err
			}

			for key, value := range circles {
				circles[key].Created = value.CreatedAt.Format(time.RFC3339)
				circles[key].User.UserID = circles[key].User.ID.String()
				messages, err := dal.ReadMessages(&value.CircleID)
				if err != nil {
					return nil, err
				}
				circles[key].NumberMessages = len(messages)
			}
			return circles, nil
		},
	}
}

//NotifyMatchedCirclesByAdminQuery Notify Matched Circles By Admin
func NotifyMatchedCirclesByAdminQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.CircleType("NotifyByAdmin")),
		Description: "Notify Matched Circles By Admin",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("User not authenticated or not enough permissions")
			}
			utils.SegmentPage("NotifyMatchedCirclesByAdminQuery", "admin", "notifyMatchedCirclesByAdmin")

			circles, err := dal.ReadCirclesNotNotified()
			if err != nil {
				return nil, err
			}

			var ciclesReduced []string

			for key, circle := range circles {
				log.Println(key, circle.CircleID)
				log.Println("Notified Email", circle.NotifiedEmail)
				log.Println("Notified PN", circle.NotifiedPN)
				if !utils.StringExistsInArray(circle.CircleID.String(), ciclesReduced) {
					ciclesReduced = append(ciclesReduced, circle.CircleID.String())
				}

				// circleid := value.CircleID.String()
				// dal.UpdateCircleNotified(&circleid)
			}

			log.Println("ciclesReduced", ciclesReduced)

			return circles, nil
		},
	}
}

//GetCircleByIDQuery Get Circle by circle id
func GetCircleByIDQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.CircleType("")),
		Description: "Get Circle by circle id",
		Args: graphql.FieldConfigArgument{
			"circleid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			circleid, ok := p.Args["circleid"].(string)
			if !ok {
				return nil, errors.New("Must provide circleid")
			}

			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("GetCircleByIDQuery", userDecoded.ID, "circle")

			circle, err := dal.ReadCircle(circleid)
			if err != nil {
				return nil, err
			}

			found := false
			for _, users := range circle {
				if users.UserID.String() == userDecoded.ID {
					found = true
					break
				}
			}

			utils.SegmentTrack("Read circle by circle id", userDecoded.ID)

			if found {
				return circle, nil
			}

			return nil, errors.New("User does not belong to this circle")
		},
	}
}

//GetCirclesByUserQuery Get all circles by user id
func GetCirclesByUserQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.CircleType("ByUser")),
		Description: "Get all circles by user id",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("GetCirclesByUserQuery", userDecoded.ID, "circlesByUser")

			useruuid, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return nil, err
			}

			circles, err := dal.ReadCirclesByUser(&useruuid)
			if err != nil {
				return nil, err
			}

			utils.SegmentTrack("Read circles by user id", userDecoded.ID)

			return circles, nil
		},
	}
}
