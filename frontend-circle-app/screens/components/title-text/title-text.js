import React from 'react';
import {defaultProps, propTypes} from './props';
import {TextWrapper, LinkIconStyled} from './styled';
import {Alert, Linking, TouchableOpacity} from 'react-native';

export const TitleText = ({
  text,
  fontSize,
  color,
  onPress,
  title,
  textAlign,
  link,
}) => {
  const loadInBrowser = () => {
    Linking.openURL(link).catch((err) =>
      Alert.alert("Couldn't load page", err.message),
    );
  };

  return (
    <TextWrapper
      fontSize={fontSize}
      color={color}
      title={title}
      onPress={onPress}
      textAlign={textAlign}>
      {text}{' '}
      {link ? (
        <TouchableOpacity onPress={() => loadInBrowser()}>
          <LinkIconStyled name="external-link" />
        </TouchableOpacity>
      ) : null}
    </TextWrapper>
  );
};

TitleText.defaultProps = defaultProps;
TitleText.propTypes = propTypes;
