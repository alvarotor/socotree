package muts

// import (
// 	"errors"

// 	"github.com/graphql-go/graphql"
// 	dal "github.com/socotree/backend-circle-app/DAL"
// 	utils "github.com/socotree/backend-circle-app/Utils"
// )

// func MigrateTables() *graphql.Field {
// 	return &graphql.Field{
// 		Type:        graphql.Boolean,
// 		Description: "Delete and migrate tables",
// 		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
// 			if utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
// 				dal.ResetTablesMigration()
// 				dal.InitialMigration()
// 				return true, nil
// 			}
// 			return nil, errors.New("Only admins can migrate tables")
// 		},
// 	}
// }
