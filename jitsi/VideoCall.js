import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import JitsiMeet, {JitsiMeetView} from 'react-native-jitsi-meet';

class VideoCall extends React.Component {
  constructor(props) {
    super(props);
    this.onConferenceTerminated = this.onConferenceTerminated.bind(this);
    this.onConferenceJoined = this.onConferenceJoined.bind(this);
    this.onConferenceWillJoin = this.onConferenceWillJoin.bind(this);
    this.state = {isLoading: true};
  }

  componentDidMount() {
    setTimeout(() => {
      const {user, avatar, email, url} = this.props.route.params;
      //   const {user, avatar, email, url} = this.props;
      const userInfo = {
        displayName: user,
        email: email,
        avatar: avatar,
        url,
      };
      //   userInfo.url = 'ariweuryiweury';
      //   userInfo.displayName = 'weuirywierh';
      //   userInfo.email = 'jdshfks@erwer.com';
      //   userInfo.avatar = 'https:/gravatar.com/avatar/abc123';
      JitsiMeet.call(userInfo.url, userInfo);
      this.setState({isLoading: false});
      /* You can also use JitsiMeet.audioCall(url) for audio only call */
      /* You can programmatically end the call with JitsiMeet.endCall() */
    }, 3000);
  }

  onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    console.log('onConferenceTerminated');
    this.props.navigation.replace('Home');
  }

  onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    console.log('onConferenceJoined');
  }

  onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    console.log('onConferenceWillJoin');
  }

  render() {
    return (
      <View style={styles.view}>
        {/* {this.state.isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : ( */}
        <JitsiMeetView
          onConferenceTerminated={this.onConferenceTerminated}
          onConferenceJoined={this.onConferenceJoined}
          onConferenceWillJoin={this.onConferenceWillJoin}
          style={styles.jitsiMeetView}
        />
        {/* )} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'black',
    flex: 1,
  },
  jitsiMeetView: {flex: 1, height: '100%', width: '100%'},
  loading: {color: 'white', fontSize: 30},
});

export default VideoCall;
