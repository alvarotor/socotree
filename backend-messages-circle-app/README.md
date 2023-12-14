Continuous delivery: https://www.youtube.com/watch?v=OEDKU_UE5aw
Android: https://www.youtube.com/watch?v=su-qGafvkCU
IOS: https://www.youtube.com/watch?v=ttNbomU8yBI

Github actions: https://blog.usejournal.com/automate-react-native-builds-with-github-actions-af54212d26dc

curl -X POST --header "Authorization: key=<API_ACCESS_KEY>" \
 --Header "Content-Type: application/json" \
 https://fcm.googleapis.com/fcm/send \
 -d "{\"to\":\"<YOUR_DEVICE_ID_TOKEN>\",\"notification\":{\"title\":\"Hello\",\"body\":\"Yellow\"}}"

Dev
curl -X POST --header "Authorization: key=AAAAnyOaYzM:APA91bFPPfkTjjakqLx9NTL4fEQlEyaGtUbKHOKouh5ZWpwh9pZ1VtzPsvX9BmvJp3RdHRu5Q2YpltLPncJJR-PgnRrGAC3C2labrm0z6VSQr5A_QjYASa3txWIoBpLqr2SO7OcDc8aH" \
 --Header "Content-Type: application/json" \
 https://fcm.googleapis.com/fcm/send \
 -d "{\"to\":\"d3mXD-K3RGWzvXTlx2aEQ8:APA91bEo5UK8hYmeBJMy2XHXdEhRr0_NSv74QZ9QUT0TX2ngEFYSGwBxly17WgY_1fkAO3ObWm1H3PAink-s0dBHmU0Yf33jpvyAWnvghEEWO41yOuOYHVLTFecCxbG7OzF3VQO5xqVl\",\"notification\":{\"title\":\"Hello\",\"body\":\"Yellow\"}}"

Staging
curl -X POST --header "Authorization: key=AAAAw7dAtYk:APA91bElvJZfqrgysGAWf1oUu9DeTMUKkksUtYBHf3OsGLl86OJlQsUB2MT-61P1yT3wUsvmJAdL38VgGffuQrwA8B75-LLGVS10J-NoQJxGvrtJqzi0VIv8kzYfUc8lllQ15K-MWxr5" \
--Header "Content-Type: application/json" \
https://fcm.googleapis.com/fcm/send \
-d "{\"to\":\"dmCv_b9ETk0pvfH91b4mBX:APA91bEF4HPKkWJuSky6cLCFb20QeEJ0c1K2mz9kDXCsY4rffUTglIYnKYk5MY674PB8kjgtslbFMprLjD4OlUWWvAcJ4a6EtOoj07QadCL4y1_xz46SvKj1pV02zJ3gmz3xfpVTZQsd\",\"notification\":{\"title\":\"Hello\",\"body\":\"Yellow\"}}"

Test
curl -X POST --header "Authorization: key=AAAAw7dAtYk:APA91bElvJZfqrgysGAWf1oUu9DeTMUKkksUtYBHf3OsGLl86OJlQsUB2MT-61P1yT3wUsvmJAdL38VgGffuQrwA8B75-LLGVS10J-NoQJxGvrtJqzi0VIv8kzYfUc8lllQ15K-MWxr5" \
 --Header "Content-Type: application/json" \
 https://fcm.googleapis.com/fcm/send \
 -d "{\"to\":\"eS_QaNM1HE5lv83dq9XW9X:APA91bFXaeTvupbshnMvJnjfvBbc8yWeM-D9q-x2AzpN-VNIavNFjHCOzgratlWfJ06zDx6rrxWHw1-zzGe7HK8-MwkD5GYux6T5YrEVw0qLhgBzmOqm_zBmqXb2tdH8WpOVw2_4T1qF\",\"notification\":{\"title\":\"Hello\",\"body\":\"Yellow\"},\"priority\": \"high\"}"

staging ten ios
curl -X POST --header "Authorization: key=AAAAw7dAtYk:APA91bElvJZfqrgysGAWf1oUu9DeTMUKkksUtYBHf3OsGLl86OJlQsUB2MT-61P1yT3wUsvmJAdL38VgGffuQrwA8B75-LLGVS10J-NoQJxGvrtJqzi0VIv8kzYfUc8lllQ15K-MWxr5" \
 --Header "Content-Type: application/json" \
 https://fcm.googleapis.com/fcm/send \
 -d "{\"to\":\"eS_QaNM1HE5lv83dq9XW9X:APA91bFXaeTvupbshnMvJnjfvBbc8yWeM-D9q-x2AzpN-VNIavNFjHCOzgratlWfJ06zDx6rrxWHw1-zzGe7HK8-MwkD5GYux6T5YrEVw0qLhgBzmOqm_zBmqXb2tdH8WpOVw2_4T1qF\",\"notification\":{\"title\":\"gheirwutwirtuywe iurty wer twe iurtoiwe rtewyrtiuw\",\"body\":\"dfjkgs fjgdsfgfgsfgsfjdfgffgsg f sdf jhsdg fjkdgsfjkds\"}}"

staging eleven android
curl -X POST --header "Authorization: key=AAAAw7dAtYk:APA91bElvJZfqrgysGAWf1oUu9DeTMUKkksUtYBHf3OsGLl86OJlQsUB2MT-61P1yT3wUsvmJAdL38VgGffuQrwA8B75-LLGVS10J-NoQJxGvrtJqzi0VIv8kzYfUc8lllQ15K-MWxr5" \
 --Header "Content-Type: application/json" \
 https://fcm.googleapis.com/fcm/send \
 -d "{\"to\":\"d0INAGeBR3GwkcR5q1vThd:APA91bE7fuMsUjbvSW-QDGxrA3dcY9G_zgeswVGemg6cp7dzn4kc7x_zH5HgEq5u4TlT3EH1ZcW5PqRJ9uM4pt_afwpdsjS8HlotuCaCSya8OAbOOxIDNB-HaGARVVfVN5y7U0ecEnVa\",\"notification\":{\"title\":\"Hello\",\"body\":\"cvbcv cv cv cv cv cv c cv \"}}"

staging phone six android
curl -X POST --header "Authorization: key=AAAAw7dAtYk:APA91bElvJZfqrgysGAWf1oUu9DeTMUKkksUtYBHf3OsGLl86OJlQsUB2MT-61P1yT3wUsvmJAdL38VgGffuQrwA8B75-LLGVS10J-NoQJxGvrtJqzi0VIv8kzYfUc8lllQ15K-MWxr5" \
 --Header "Content-Type: application/json" \
 https://fcm.googleapis.com/fcm/send \
 -d "{\"to\":\"exZ2wltjQByHJhUFH3dkI-:APA91bHgFIQnQ4WeAmiQAeHmQSfh402dcu5-pPj1oqVZoeAyroFLaYU2bC1W26ltFAmgJQGuQUYdIVxKANyEra7KaW9wmGaVngdCJbkiH9q2Fy5_qPM8jb0CqkLLjmMs3PZiU61tlrbI\",\"notification\":{\"title\":\"Hello\",\"body\":\"Yellow4\"},\"priority\": \"high\"}"

dev amailinator
curl -X POST --header "Authorization: key=AAAAnyOaYzM:APA91bFPPfkTjjakqLx9NTL4fEQlEyaGtUbKHOKouh5ZWpwh9pZ1VtzPsvX9BmvJp3RdHRu5Q2YpltLPncJJR-PgnRrGAC3C2labrm0z6VSQr5A_QjYASa3txWIoBpLqr2SO7OcDc8aH" \
 --Header "Content-Type: application/json" \
 https://fcm.googleapis.com/fcm/send \
 -d "{\"to\":\"fl6_p3VVSfyrbm04LQjybs:APA91bH-rmBWD76FlhLQrwdstRvlgMmRSt39wnPJdZy9VOpsOIELkBkXHp2yMIxscHYcqy_fQJuLrbFv-qBM_kV1WD8L9VmyvvPsaU7mUPBa4vQpLyltqQWiskKBWTFrY9aWulLwa9Is\",\"notification\":{\"title\":\"Hello\",\"body\":\"Yellow\"},\"priority\": \"high\"}"

import Toast from 'react-native-toast-message';
import PushNotification from 'react-native-push-notification';

    Toast.show({
      text1: 'onNotificationOpenedApp',
      text2: 'onNotificationOpenedApp 2',
    });
    PushNotification.localNotification({
      bigText: 'body', // (optional) default: "message" prop
      subText: 'body', // (optional) default: none
      // ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      /* iOS and Android properties */
      title: 'title', // (optional)
      message: 'body', // (required)
    });
