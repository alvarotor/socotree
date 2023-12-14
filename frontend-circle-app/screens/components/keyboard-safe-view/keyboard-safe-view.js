import React, {Component} from 'react';
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import styles from './keyboard-safe-styles';

const IS_IOS = Platform.OS === 'ios';
export default class KeyboardSafeView extends Component {
  render() {
    const {
      style,
      subContentStyle,
      children,
      offset = 0,
      iosBehavior = 'padding',
      androidBehavior = null,
    } = this.props;
    const behavior = IS_IOS ? iosBehavior : androidBehavior;
    return (
      <TouchableWithoutFeedback
        style={[styles.container, style]}
        disabled={true}>
        <KeyboardAvoidingView
          enabled
          behavior={behavior}
          keyboardVerticalOffset={offset}
          style={styles.container}>
          <View style={[styles.container, subContentStyle]}>{children}</View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}
