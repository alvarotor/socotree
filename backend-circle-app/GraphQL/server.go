package graphql

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

var schema graphql.Schema

func init() {
	fmt.Println("INIT graphql")

	var err error

	schema, err = graphql.NewSchema(graphql.SchemaConfig{
		Query:    queries(),
		Mutation: mutations(),
	})
	if err != nil {
		log.Fatalf("failed to create new graphql schema, error: %v", err)
	}

	// // Query
	// query := `
	//     {
	//         hella
	//     }
	// `

	// params := graphql.Params{Schema: schema, RequestString: query}
	// r := graphql.Do(params)
	// if len(r.Errors) > 0 {
	// 	log.Fatalf("failed to execute graphql operation, errors: %+v", r.Errors)
	// }
	// rJSON, _ := json.Marshal(r)
	// fmt.Printf("%s \n", rJSON) // {“data”:{“hello”:”world”}}
}

func handleMiddleware(h *handler.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// handle cors
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Authentication, Content-Type, Content-Length, Accept-Encoding")

		// if r.Method == "OPTIONS" {
		// 	w.Header().Set("Access-Control-Max-Age", "86400")
		// 	w.WriteHeader(http.StatusOK)
		// 	return
		// }

		authentication := "Authentication"
		ctx := context.WithValue(r.Context(), authentication, r.Header.Get(authentication))
		h.ServeHTTP(w, r.WithContext(ctx))
	})
}

//Serve the graphql server
func Serve() {
	env := os.Getenv("HOST")

	var pretty = true
	var graphiQL = true
	var playground = true

	if env == "api.circles.berlin" {
		pretty = false
		graphiQL = false
		playground = false
	}

	h := handler.New(&handler.Config{
		Schema:     &schema,
		Pretty:     pretty,
		GraphiQL:   graphiQL,
		Playground: playground,
	})

	http.HandleFunc("/v1/uploadevent/", UploadFileEvent)
	http.HandleFunc("/v1/upload/", UploadFile)
	http.HandleFunc("/v1/upload64/", UploadFile64)
	http.HandleFunc("/v1/health/", HealthRequest)
	http.Handle("/v1/graphql/", handleMiddleware(h))

	fmt.Println(fmt.Sprintf("Health endpoint Circles at http://%s:3001/v1/health/", env))
	fmt.Println(fmt.Sprintf("Server Circles started at http://%s:3001/v1/graphql/", env))
	log.Fatal(http.ListenAndServe(":3001", nil))
}
