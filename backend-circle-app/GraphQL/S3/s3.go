package S3

import (
	"bytes"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

const (
	//AwsS3Region Aws S3 Region
	AwsS3Region = "eu-central-1"
	//AwsS3Bucket Aws S3 Bucket
	AwsS3Bucket = "circles.berlin"
)

var sess = ConnectAWS()

//ConnectAWS Connect to AWS
func ConnectAWS() *session.Session {
	sess, err := session.NewSession(
		&aws.Config{
			Region: aws.String(AwsS3Region),
		},
	)
	if err != nil {
		log.Println("Error connecting to s3")
		log.Println(err)
	}
	return sess
}

//DeleteAWS Upload to AWS
func DeleteAWS(file *string) error {
	request := &s3.DeleteObjectInput{
		Bucket: aws.String(AwsS3Bucket),
		Key:    file,
	}

	_, err := s3.New(sess).DeleteObject(request)
	return err
}

//UploadAWS Upload to AWS
func UploadAWS(file multipart.File, filename string) error {
	uploader := s3manager.NewUploader(sess)

	_, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(AwsS3Bucket), // Bucket to be used
		// ContentType: aws.String(typefile),
		Key:  aws.String(filename), // Name of the file to be saved
		Body: file,                 // File
	})
	return err
}

//UploadAWSFile Upload to AWS by file
func UploadAWSFile(fileDir string, filename string) error {

	// Open the file for use
	file, err := os.Open(fileDir)
	if err != nil {
		return err
	}
	defer file.Close()

	// Get file size and read the file content into a buffer
	fileInfo, _ := file.Stat()
	var size int64 = fileInfo.Size()
	buffer := make([]byte, size)
	file.Read(buffer)

	// Config settings: this is where you choose the bucket, filename, content-type etc.
	// of the file you're uploading.
	_, err = s3.New(sess).PutObject(&s3.PutObjectInput{
		Bucket: aws.String(AwsS3Bucket),
		Key:    aws.String(filename),
		// ACL:                  aws.String("public-read"),
		Body:                 bytes.NewReader(buffer),
		ContentLength:        aws.Int64(size),
		ContentType:          aws.String(http.DetectContentType(buffer)),
		ContentDisposition:   aws.String("attachment"),
		ServerSideEncryption: aws.String("AES256"),
	})
	return err
}
