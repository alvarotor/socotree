package muts

import (
	"errors"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	s3 "github.com/socotree/backend-circle-app/GraphQL/S3"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
	"github.com/socotree/backend-circle-app/grpc"

	"golang.org/x/crypto/bcrypt"
)

//CreateUser Create user
func CreateUser() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Create user",
		Args: graphql.FieldConfigArgument{
			"email": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"password": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("CreateUser", "free access", "createUser")
			var email string
			if val, ok := params.Args["email"]; ok {
				email = strings.ToLower(val.(string))
				if len(email) == 0 {
					return false, errors.New("email cant be empty")
				}
			}
			var password string
			if val, ok := params.Args["password"]; ok {
				password = val.(string)
				if len(password) <= 3 {
					return false, errors.New("password cant be empty and be less than 3 characters")
				}
			}

			pass := []byte(params.Args["password"].(string))
			hash, err := bcrypt.GenerateFromPassword(pass, bcrypt.DefaultCost)
			if err != nil {
				return false, err
			}

			user := &models.User{
				Email:    email,
				Password: string(hash),
				Profile: models.Profile{
					NewsUpdate:             true,
					Logged:                 true,
					EmailsSwitch:           true,
					PushNotificationSwitch: true,
				},
			}

			err = dal.AddUser(user)
			if err != nil {
				return false, err
			}

			utils.SegmentIdentifyCreate(user.ID.String())

			return true, nil
		},
	}
}

//ForgotPassword Forgot password
func ForgotPassword() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Forgot password",
		Args: graphql.FieldConfigArgument{
			"email": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("ForgotPassword", "ForgotPassword", "forgotPassword")

			var email string
			if val, ok := params.Args["email"]; ok {
				email = val.(string)
				if len(email) == 0 {
					return false, errors.New("email cant be empty")
				}
			}

			user, err := dal.ReadUserByEmail(&email)
			if err != nil {
				return false, err
			}

			user.RecoveryCode = randInt(1000, 9999)

			err = dal.UpdateUser(&user)
			if err != nil {
				return false, err
			}

			go grpc.ConnectNotificationsForgottenPassword(user.Email, "New Circles Forgot Password!", user.RecoveryCode, user.ID.String())

			utils.SegmentTrack("Forgot password", email)

			return true, nil
		},
	}
}

//UpdateUser Update user
func UpdateUser() *graphql.Field {
	return &graphql.Field{
		Type:        types.ProfileType("Update"),
		Description: "Update user",
		Args: graphql.FieldConfigArgument{
			"name": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"photo": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"fcmtoken": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"profession": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"district": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"login": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"ageyear": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"agemonth": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"ageday": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"phone": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"phoneprefix": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"newsupdate": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"pushnotificationswitch": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"logged": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"emailsswitch": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"platform": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"build": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("UpdateUser", userDecoded.ID, "updateUser")

			uuid, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return nil, err
			}

			user, err := dal.ReadUserWithProfile(&uuid)
			if err != nil {
				return nil, err
			}
			if val, ok := p.Args["name"]; ok {
				user.Profile.Name = val.(string)
			}
			if val, ok := p.Args["photo"]; ok {
				user.Profile.Photo = val.(string)
			}
			if val, ok := p.Args["fcmtoken"]; ok {
				user.Profile.FcmToken = val.(string)
			}
			if val, ok := p.Args["phone"]; ok {
				user.Profile.Phone = val.(string)
			}
			if val, ok := p.Args["phoneprefix"]; ok {
				user.Profile.PhonePrefix = val.(string)
			}
			if val, ok := p.Args["profession"]; ok {
				user.Profile.Profession = val.(string)
			}
			if val, ok := p.Args["district"]; ok {
				user.Profile.District = val.(int)
			}
			if val, ok := p.Args["login"]; ok {
				user.Profile.Login = val.(string)
			}
			if val, ok := p.Args["ageyear"]; ok {
				user.Profile.AgeYear = val.(int)
			}
			if val, ok := p.Args["agemonth"]; ok {
				user.Profile.AgeMonth = val.(int)
			}
			if val, ok := p.Args["ageday"]; ok {
				user.Profile.AgeDay = val.(int)
			}
			if val, ok := p.Args["newsupdate"]; ok {
				user.Profile.NewsUpdate = val.(bool)
			}
			if val, ok := p.Args["pushnotificationswitch"]; ok {
				user.Profile.PushNotificationSwitch = val.(bool)
			}
			if val, ok := p.Args["logged"]; ok {
				user.Profile.Logged = val.(bool)
			}
			if val, ok := p.Args["emailsswitch"]; ok {
				user.Profile.EmailsSwitch = val.(bool)
			}
			if val, ok := p.Args["platform"]; ok {
				user.Profile.Platform = val.(string)
			}
			if val, ok := p.Args["build"]; ok {
				user.Profile.Build = val.(int)
			}

			err = dal.UpdateProfile(&user.Profile)
			if err != nil {
				return nil, err
			}

			utils.SegmentIdentify(&user)

			return user.Profile, nil
		},
	}
}

//ResetPassword Reset Password
func ResetPassword() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Reset password",
		Args: graphql.FieldConfigArgument{
			"code": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"password": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			utils.SegmentPage("ResetPassword", "ResetPassword", "resetPassword")

			FPCode, ok := p.Args["code"].(string)
			if !ok {
				return false, errors.New("code is not found")
			}
			Password, ok := p.Args["password"].(string)
			if !ok {
				return false, errors.New("password is not found")
			}

			if len(Password) <= 3 {
				return false, errors.New("password cant be empty and be less than 3 characters")
			}

			user, err := dal.ReadUserByFPCode(&FPCode)
			if err != nil {
				return nil, err
			}

			pass := []byte(Password)
			hash, err := bcrypt.GenerateFromPassword(pass, bcrypt.DefaultCost)
			if err != nil {
				return false, err
			}

			strHash := string(hash)
			user.Password = strHash
			user.RecoveryCode = 0

			err = dal.UpdateUser(&user)
			if err != nil {
				return false, err
			}

			utils.SegmentTrack("Reset password", user.ID.String())

			return true, nil
		},
	}
}

//UpdatePassword Update password
func UpdatePassword() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Update password",
		Args: graphql.FieldConfigArgument{
			"password": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("UpdatePassword", userDecoded.ID, "updatePassword")

			uuid, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return nil, err
			}

			user, err := dal.ReadUser(&uuid)
			if err != nil {
				return false, err
			}

			if val, ok := p.Args["password"]; ok {
				if len(val.(string)) <= 3 {
					return false, errors.New("password cant be empty and be less than 3 characters")
				}

				pass := []byte(val.(string))
				hash, err := bcrypt.GenerateFromPassword(pass, bcrypt.DefaultCost)
				if err != nil {
					return false, err
				}
				strHash := string(hash)
				user.Password = strHash

				err = dal.UpdateUser(&user)
				if err != nil {
					return false, err
				}

				utils.SegmentTrack("Update password", userDecoded.ID)
				return true, nil
			}
			return false, errors.New("password is not found")
		},
	}
}

//DeleteUser Delete user
func DeleteUser() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Delete user",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("DeleteUser", userDecoded.ID, "deleteUser")

			uuid, err := uuid.FromString(userDecoded.ID)
			if err != nil {
				return nil, err
			}

			model, err := dal.ReadUser(&uuid)
			if err != nil {
				return nil, err
			}

			events, err := dal.ReadEvents()
			if err != nil {
				return nil, err
			}

			for _, event := range events {
				if err = dal.DeleteUserInEventJoined(&event.ID, &model.ID); err != nil {
					return nil, err
				}
				if err = dal.DeleteUserInEventRegister(&event.ID, &model.ID); err != nil {
					return nil, err
				}
			}

			if err = dal.DeleteUser(&model.ID); err != nil {
				return nil, err
			}

			photo := model.ID.String() + ".jpg"
			if err = s3.DeleteAWS(&photo); err != nil {
				return nil, err
			}

			utils.SegmentTrack("Delete user", userDecoded.ID)

			return true, nil
		},
	}
}

//UpdateUserAdminByAdmin Update User Admin ByAdmin
func UpdateUserAdminByAdmin() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Update user admin field by admin",
		Args: graphql.FieldConfigArgument{
			"userid": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"admin": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("only admins can update admin verified")
			}
			utils.SegmentPage("UpdateUserAdminByAdmin", "admin", "updateUserAdminByAdmin")

			if val, ok := p.Args["userid"]; ok {

				userid := val.(string)
				uuid, err := uuid.FromString(userid)
				if err != nil {
					return nil, err
				}

				user, err := dal.ReadUserWithProfile(&uuid)
				if err != nil {
					return nil, err
				}

				if val, ok := p.Args["admin"]; ok {

					user.Profile.Admin = val.(bool)
					log.Println("Admin", user.Profile.Admin)
					err = dal.UpdateProfile(&user.Profile)
					log.Println("Admin2", user.Profile.Admin)
					if err != nil {
						return nil, err
					}
					return true, nil

				}
				return false, errors.New("admin argument value not valid or not found")
			}
			return false, errors.New("UserID argument not valid or not found")
		},
	}
}

//UpdateUserAdminVerifiedByAdmin Update User Admin Verified By Admin
func UpdateUserAdminVerifiedByAdmin() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Update user AdminVerified field by admin",
		Args: graphql.FieldConfigArgument{
			"userid": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"adminverified": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("only admins can update admin verified")
			}
			utils.SegmentPage("UpdateUserAdminVerifiedByAdmin", "admin", "updateUserAdminVerifiedByAdmin")

			if val, ok := p.Args["userid"]; ok {
				userid := val.(string)
				uuid, err := uuid.FromString(userid)
				if err != nil {
					return nil, err
				}

				user, err := dal.ReadUserWithProfile(&uuid)
				if err != nil {
					return nil, err
				}

				if val, ok := p.Args["adminverified"]; ok {

					user.Profile.AdminVerified = val.(bool)
					log.Println("AdminVerified", user.Profile.AdminVerified)
					err = dal.UpdateProfile(&user.Profile)
					log.Println("AdminVerified2", user.Profile.AdminVerified)
					if err != nil {
						return nil, err
					}

					if user.Profile.AdminVerified {
						go grpc.ConnectNotificationsUserVerifiedEmail(user.Email, user.Profile.Name, user.ID.String())
						go grpc.ConnectNotificationsUserVerifiedPN(user.Profile.FcmToken, user.ID.String())
					}

					return true, nil
				}
				return false, errors.New("admin argument value not valid or not found")
			}
			return false, errors.New("UserID argument not valid or not found")
		},
	}
}

func UpdateUserAdminRejectedByAdmin() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Update user AdminRejected field by admin",
		Args: graphql.FieldConfigArgument{
			"userid": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"adminrejectedname": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"adminrejecteddob": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"adminrejectedphoto": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"adminrejectedinterests": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"adminrejecteddistrict": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"adminrejectedquestions": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("only admins can update admin verified")
			}
			utils.SegmentPage("UpdateUserAdminRejectedByAdmin", "admin", "updateUserAdminRejectedByAdmin")

			if val, ok := p.Args["userid"]; ok {
				userid := val.(string)
				uuid, err := uuid.FromString(userid)
				if err != nil {
					return nil, err
				}

				user, err := dal.ReadUserWithProfile(&uuid)
				if err != nil {
					return nil, err
				}

				if val, ok := p.Args["adminrejectedname"]; !ok {
					return false, errors.New("adminrejectedname argument value not valid or not found")
				} else {
					user.Profile.AdminRejectedName = val.(bool)
				}

				if val, ok := p.Args["adminrejecteddob"]; !ok {
					return false, errors.New("adminrejecteddob argument value not valid or not found")
				} else {
					user.Profile.AdminRejectedDOB = val.(bool)
				}

				if val, ok := p.Args["adminrejectedphoto"]; !ok {
					return false, errors.New("adminrejectedphoto argument value not valid or not found")
				} else {
					user.Profile.AdminRejectedPhoto = val.(bool)
				}

				if val, ok := p.Args["adminrejectedinterests"]; !ok {
					return false, errors.New("adminrejectedinterests argument value not valid or not found")
				} else {
					user.Profile.AdminRejectedInterests = val.(bool)
				}

				if val, ok := p.Args["adminrejecteddistrict"]; !ok {
					return false, errors.New("adminrejecteddistrict argument value not valid or not found")
				} else {
					user.Profile.AdminRejectedDistrict = val.(bool)
				}

				if val, ok := p.Args["adminrejectedquestions"]; !ok {
					return false, errors.New("adminrejectedquestions argument value not valid or not found")
				} else {
					user.Profile.AdminRejectedQuestions = val.(bool)
				}

				err = dal.UpdateProfile(&user.Profile)
				if err != nil {
					return nil, err
				}

				p := user.Profile
				if p.PushNotificationSwitch && p.Logged {
					if p.AdminRejectedDOB || p.AdminRejectedDistrict || p.AdminRejectedInterests || p.AdminRejectedName || p.AdminRejectedPhoto || p.AdminRejectedQuestions {
						go grpc.ConnectNotificationsUserRejectedPN(user.Profile.FcmToken, user.Profile)
					} else {
						go grpc.ConnectNotificationsUserNoRejectedPN(user.Profile.FcmToken)
					}
				} else {
					log.Println("user not notified in admin rejected as PushNotificationSwitch is false or is not logged")
				}

				return true, nil
			}
			return false, errors.New("userID argument not valid or not found")
		},
	}
}

//UpdateInterestAdminVerified Update Interest Admin Verified
func UpdateInterestAdminVerified() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Update Interest AdminVerified field by admin",
		Args: graphql.FieldConfigArgument{
			"interestid": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"adminverified": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("only admins can update admin verified")
			}
			utils.SegmentPage("UpdateInterestAdminVerified", "admin", "updateInterestAdminVerified")

			if val, ok := p.Args["interestid"]; ok {

				interestid := val.(string)
				uuid, err := uuid.FromString(interestid)
				if err != nil {
					return nil, err
				}

				interest, err := dal.ReadInterest(&uuid)
				if err != nil {
					return nil, err
				}

				if val, ok := p.Args["adminverified"]; ok {

					interest.AdminVerified = val.(bool)
					err = dal.UpdateInterest(&interest)
					if err != nil {
						return nil, err
					}
					return true, nil

				}
				return false, errors.New("admin argument value not valid or not found")
			}
			return false, errors.New("InterestID argument not valid or not found")
		},
	}
}

//BlockProfile Block user profile
func BlockProfile() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Block user profile",
		Args: graphql.FieldConfigArgument{
			"profile": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecode, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("BlockProfile", userDecode.ID, "blockProfile")

			var profile string
			if val, ok := p.Args["profile"]; ok {
				profile = val.(string)
			}

			userID, err := uuid.FromString(userDecode.ID)
			if err != nil {
				return false, err
			}

			profileID, err := uuid.FromString(profile)
			if err != nil {
				return false, err
			}

			modelBlocked := models.BlockedUsers{
				UserBlockerID: userID,
				UserBlockedID: profileID,
			}
			err = dal.AddBlockedProfile(&modelBlocked)
			if err != nil {
				return false, err
			}

			utils.SegmentTrackBlockingUser(userDecode.ID, profileID.String())

			return true, nil
		},
	}
}

func UnblockProfile() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Unblock user profile",
		Args: graphql.FieldConfigArgument{
			"profile": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecode, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("UnblockProfile", userDecode.ID, "unblockProfile")

			var profile string
			if val, ok := p.Args["profile"]; ok {
				profile = val.(string)
			}

			err = dal.RemoveBlockedProfile(userDecode.ID, profile)
			if err != nil {
				return false, err
			}

			utils.SegmentTrackUnBlockingUser(userDecode.ID, profile)

			return true, nil
		},
	}
}

//VerifyUserEmail Verify user email
func VerifyUserEmail() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Verify user email",
		Args: graphql.FieldConfigArgument{
			"code": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecode, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("VerifyUserEmail", userDecode.ID, "verifyUserEmail")

			id, err := uuid.FromString(userDecode.ID)
			if err != nil {
				return false, err
			}

			user, err := dal.ReadUser(&id)
			if err != nil {
				return false, err
			}

			if val, ok := p.Args["code"]; ok {

				if val.(int) != int(user.RecoveryCode) {
					return false, errors.New("email verification code does not match")
				}

				user.EmailVerified = true
				user.RecoveryCode = 0
				err := dal.UpdateUser(&user)
				if err != nil {
					return false, err
				}

				utils.SegmentTrack("Verify user email", userDecode.ID)

				return true, nil
			}

			utils.SegmentTrack("Verify user email - code no valid", userDecode.ID)

			return false, errors.New("code argument value not valid or not found")
		},
	}
}

// ReSendVerifyUserEmail Resend verify user email
func ReSendVerifyUserEmail() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Resend verify user email",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecode, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("ReSendVerifyUserEmail", userDecode.ID, "reSendVerifyUserEmail")

			id, err := uuid.FromString(userDecode.ID)
			if err != nil {
				return false, err
			}

			user, err := dal.ReadUser(&id)
			if err != nil {
				return false, err
			}

			user.EmailVerified = false
			user.RecoveryCode = randInt(1000, 9999)
			err = dal.UpdateUser(&user)
			if err != nil {
				return false, err
			}

			go grpc.ConnectNotificationsVerifyUserEmail(user.Email, user.RecoveryCode, userDecode.ID)

			utils.SegmentTrack("Resend verify user email", userDecode.ID)

			return true, nil
		},
	}
}

// randInt randomize int number
func randInt(min int32, max int32) int32 {
	rand.Seed(time.Now().UTC().UnixNano())
	return min + rand.Int31n(max-min)
}
