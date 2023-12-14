import React, {Component} from 'react';
import {View} from 'react-native';
import styles from './template-styles';
import KeyboardSafeView from './keyboard-safe-view';

export default class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {children} = this.props;

    return (
      <View style={styles.bgContainer}>
        <KeyboardSafeView subContentStyle={styles.container}>
          {children}
        </KeyboardSafeView>
      </View>
    );
  }
}
