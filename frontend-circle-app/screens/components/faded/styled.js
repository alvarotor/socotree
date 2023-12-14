import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  absoluteWrapper: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  fadedInner: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
