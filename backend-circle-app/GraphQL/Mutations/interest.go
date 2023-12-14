package muts

import (
	"encoding/json"
	"errors"
	"strings"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
	"github.com/socotree/backend-circle-app/grpc"
)

func CreateInterest() *graphql.Field {
	return &graphql.Field{
		Type:        types.InterestType("Create"),
		Description: "Create interest",
		Args: graphql.FieldConfigArgument{
			"interest": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"weight": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Float),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can create interests")
			}
			utils.SegmentPage("CreateInterest", "admin", "createInterest")

			var interest string
			if val, ok := p.Args["interest"]; ok {
				interest = val.(string)
			}
			var weight float64
			if val, ok := p.Args["weight"]; ok {
				weight = val.(float64)
			}
			model := models.Interest{
				Name:   interest,
				Weight: float32(weight),
			}
			err := dal.AddInterest(&model)
			if err != nil {
				return nil, err
			}
			model.UUID = model.ID.String()
			return model, nil
		},
	}
}

//DeleteInterest Delete Interest
func DeleteInterest() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete interest",
		Args: graphql.FieldConfigArgument{
			"interestid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can delete interests")
			}
			utils.SegmentPage("DeleteInterest", "admin", "deleteInterest")

			var intereststr string
			if val, ok := p.Args["interestid"]; ok {
				intereststr = val.(string)
			}
			interestID, err := uuid.FromString(intereststr)
			if err != nil {
				return false, err
			}
			err = dal.DeleteInterest(&interestID)
			if err != nil {
				return nil, err
			}
			return true, nil
		},
	}
}

func UpdateInterest() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Update interest",
		Args: graphql.FieldConfigArgument{
			"interestid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"interest": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"weight": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Float),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can update interests")
			}
			utils.SegmentPage("UpdateInterest", "admin", "updateInterest")

			var weight float64
			if val, ok := p.Args["weight"]; ok {
				weight = val.(float64)
			}
			var interestidstr string
			if val, ok := p.Args["interestid"]; ok {
				interestidstr = val.(string)
			}
			var intereststr string
			if val, ok := p.Args["interest"]; ok {
				intereststr = val.(string)
			}
			interestID, err := uuid.FromString(interestidstr)
			if err != nil {
				return false, err
			}
			interest, err := dal.ReadInterest(&interestID)
			if err != nil {
				return nil, err
			}

			interest.Name = intereststr
			interest.Weight = float32(weight)

			err = dal.UpdateInterest(&interest)
			if err != nil {
				return nil, err
			}

			return true, nil
		},
	}
}

//CreateUserInterests Create User Interests
func CreateUserInterests() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Create user interests",
		Args: graphql.FieldConfigArgument{
			"interests": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("CreateUserInterests", userDecoded.ID, "createUserInterests")

			var interests string
			if val, ok := p.Args["interests"]; ok {
				interests = val.(string)
			}
			userID, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return nil, err
			}
			interests = strings.ReplaceAll(interests, "'", "\"")
			rawIn := json.RawMessage(interests)
			bytes, err := rawIn.MarshalJSON()
			if err != nil {
				return nil, err
			}
			var uA []models.UserInterest
			err = json.Unmarshal(bytes, &uA)
			if err != nil {
				var uAs []models.UserInterestStrings
				uA = nil
				err = json.Unmarshal(bytes, &uAs)
				if err != nil {
					return nil, err
				}
				for _, strInterest := range uAs {
					var newInterest models.Interest
					var newUserInterest models.UserInterest
					aInterestID, err := uuid.FromString(strInterest.InterestID)
					if err != nil {
						foundInterest, err := dal.FindInterest(strInterest.InterestID)
						if err == nil {
							newUserInterest = models.UserInterest{
								InterestID: foundInterest.ID,
							}
						} else {
							newInterest = models.Interest{
								Name:   strInterest.InterestID,
								Weight: 1,
							}
							err = dal.AddInterest(&newInterest)
							if err != nil {
								return nil, err
							}
							go grpc.ConnectNotificationsInterests(strInterest.InterestID)
							newUserInterest = models.UserInterest{
								InterestID: newInterest.ID,
							}
							utils.SegmentTrack("User added interest", userDecoded.ID)
						}
					} else {
						newUserInterest = models.UserInterest{
							InterestID: aInterestID,
						}
					}
					uA = append(uA, newUserInterest)
				}
			}
			for _, saveInterest := range uA {
				saveInterest.UserID = userID
				if err = dal.AddUserInterests(&saveInterest); err != nil {
					return nil, err
				}
			}
			return true, nil
		},
	}
}

//DeleteUserInterests Delete user interests
func DeleteUserInterests() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete user interests",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return nil, err
			}
			utils.SegmentPage("DeleteUserInterests", userDecoded.ID, "deleteUserInterests")

			userID, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return nil, err
			}
			if err = dal.DeleteAllUserInterests(&userID); err != nil {
				return nil, err
			}

			utils.SegmentTrack("Delete user interests", userDecoded.ID)

			return true, nil
		},
	}
}
