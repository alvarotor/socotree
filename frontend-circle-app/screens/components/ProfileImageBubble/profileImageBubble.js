import React from 'react';
import {defaultProps, propTypes} from './props';
import {
  ColorViewWrapper,
  MainViewWrapper,
  ImageViewWrapper,
  ImageWrapper,
} from './styled';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const ProfileImageBubble = ({image, icon}) => {
  return (
    <MainViewWrapper>
      <ColorViewWrapper color="#00ff00" />
      <ColorViewWrapper color="#00ff00" />
      <ImageViewWrapper color={icon ? '#6fec3d' : '#60e4fa'}>
        {icon ? (
          <Icon name="check" size={55} color="white" />
        ) : (
          <ImageWrapper
            source={{
              uri:
                image && image !== 'null'
                  ? image
                  : 'https://i.vimeocdn.com/portrait/58832_300x300.jpg',
            }}
          />
        )}
      </ImageViewWrapper>
      <ColorViewWrapper color="#00ff00" />
      <ColorViewWrapper color="#00ff00" />
    </MainViewWrapper>
  );
};

ProfileImageBubble.defaultProps = defaultProps;
ProfileImageBubble.propTypes = propTypes;
