package qs

import (
	"github.com/graphql-go/graphql"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//UpdatedVersionQuery Get updated version
func UpdatedVersionQuery() *graphql.Field {
	return &graphql.Field{
		Type:        types.UpdatedVersionType(),
		Description: "Get Updated Version build",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("UpdatedVersionQuery", "free access", "updatedVersion")

			model, err := dal.ReadUpdateVersion()
			if err != nil {
				return nil, err
			}

			return model, nil
		},
	}
}
