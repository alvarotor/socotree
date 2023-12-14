package graphql

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"image/jpeg"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	s3 "github.com/socotree/backend-circle-app/GraphQL/S3"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//UploadFile Upload Images to S3
func UploadFile(w http.ResponseWriter, r *http.Request) {
	log.Println("File Upload Endpoint Hit")
	log.Printf("%v %v %v", r.RemoteAddr, r.ContentLength, r.Body)

	if r.Method != "POST" {
		log.Println("Error Wrong Method")
		http.Error(w, "Error Wrong Method", http.StatusBadRequest)
		return
	}

	userID, err := utils.GetUserID(r.Header.Get("Authentication"))
	if len(userID) == 0 || err != nil {
		log.Println("Error retrieving the user ID")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Parse our multipart form, 10 << 20 specifies a maximum upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("photo")
	if err != nil {
		log.Println("Error Retrieving the File")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	log.Printf("Uploaded File (userID): %+v\n", handler.Filename)
	log.Printf("File Size: %+v\n", handler.Size)
	log.Printf("MIME Header: %+v\n", handler.Header)

	if userID != handler.Filename {
		log.Println("Error Retrieving the user id")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	timeNow := time.Now().Format(time.RFC3339)
	filename := userID + "-" + timeNow + ".jpg"
	err = s3.UploadAWS(file, filename)
	if err != nil {
		log.Println("Error uploading the file to s3")
		log.Println(err)
		return
	}

	log.Println("Successfully Uploaded File: " + filename)

	h := &models.Health{
		App:    filename,
		Status: "true",
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(h)
}

//UploadFile64 Upload Images to S3 from base64 data
func UploadFile64(w http.ResponseWriter, r *http.Request) {
	var u models.Upload

	log.Println("File Upload Endpoint Hit 64")
	log.Printf("%v %v %v", r.RemoteAddr, r.ContentLength, r.Body)

	if r.Method != "POST" {
		log.Println("Error Wrong Method")
		http.Error(w, "Error Wrong Method", http.StatusBadRequest)
		return
	}

	userID, err := utils.GetUserID(r.Header.Get("Authentication"))
	if len(userID) == 0 || err != nil {
		log.Println("Error retrieving the user ID")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if userID != u.UserID {
		log.Println("Error comparing the user id")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	idx := strings.Index(u.Data, ";base64,")
	if idx < 0 {
		log.Println("InvalidImage")
		http.Error(w, "InvalidImage", http.StatusBadRequest)
		return
	}
	ImageType := u.Data[11:idx]
	log.Println(ImageType)

	dec, err := base64.StdEncoding.DecodeString(u.Data[idx+8:])
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	read := bytes.NewReader(dec)

	file, err := ioutil.TempFile("/tmp", "user.*.pic")
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer os.Remove(file.Name())

	ima, err := jpeg.Decode(read)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = jpeg.Encode(file, ima, nil)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fi, err := file.Stat()
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("The file is %d bytes long", fi.Size())
	log.Printf("The file name is %v", file.Name())

	timeNow := time.Now().Format(time.RFC3339)
	filename := u.UserID + "-" + timeNow + ".jpg"

	err = s3.UploadAWSFile(file.Name(), filename)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Println("Successfully Uploaded File: " + filename)

	h := &models.Health{
		App:    filename,
		Status: "true",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(h)
}

//UploadFileEvent Upload Images Event to S3
func UploadFileEvent(w http.ResponseWriter, r *http.Request) {
	// handle cors
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Authentication, Content-Type, Content-Length, Accept-Encoding")

	if r.Method == "OPTIONS" {
		log.Println("OPTIONS return")
		return
	}

	log.Println("File Upload Event Endpoint Hit")
	log.Printf("%v %v %v", r.RemoteAddr, r.ContentLength, r.Body)
	log.Println(r.Method)

	if r.Method != "POST" {
		log.Println("Error Wrong Method")
		http.Error(w, "Error Wrong Method", http.StatusBadRequest)
		return
	}

	if !utils.IsAdminFromHeader(r.Header.Get("Authentication")) {
		log.Println("Must be admin")
		http.Error(w, "Must be admin", http.StatusBadRequest)
		return
	}

	// Parse our multipart form, 10 << 20 specifies a maximum upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)

	eventid := r.FormValue("eventid")

	uuid, err := uuid.FromString(eventid)
	if err != nil {
		log.Println("Error Retrieving the event uuid")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	event, err := dal.ReadEventNoTime(&uuid)
	if err != nil {
		log.Println("Error Retrieving the event id")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		log.Println("Error Retrieving the File")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	log.Printf("Uploaded File (event ID): %+v\n", handler.Filename)
	log.Printf("File Size: %+v\n", handler.Size)
	log.Printf("MIME Header: %+v\n", handler.Header)

	if len(handler.Filename) == 0 {
		log.Println("Error Retrieving the file name")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	timeNow := time.Now().Format(time.RFC3339)
	filename := eventid + "-event-" + timeNow + ".jpg"
	err = s3.UploadAWS(file, filename)
	if err != nil {
		log.Println("Error uploading the file to s3")
		log.Println(err)
		return
	}

	log.Println("Successfully Uploaded File: " + filename)

	event.Picture = filename
	err = dal.UpdateEvent(&event)
	if err != nil {
		log.Println("Error updating event picture")
		log.Println(err)
		return
	}

	h := &models.Health{
		App:    filename,
		Status: "true",
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(h)
}
