import React from 'react';
import {defaultProps, propTypes} from '../components/propsNavigation';
import {
  ListText,
  UnderlineText,
  UnderlineTextWrapper,
  TextWrapper,
  ExampleListText,
} from './styled';
import {TitleText} from '../components/title-text';
import {View} from 'react-native';

export const HowCirclesWorksScreen = () => {
  return (
    <View>
      <TextWrapper>
        <ListText>
          <TitleText
            title={true}
            fontSize={'18px'}
            text="How is our app working?"
          />
        </ListText>
        <TitleText
          fontSize={'18px'}
          text="In our app, it’s all about events that you can take part in."
        />
      </TextWrapper>
      <TextWrapper>
        <TextWrapper>
          <ListText>
            <TitleText
              fontSize={'18px'}
              title={true}
              text="How can you take part in an event?"
            />
          </ListText>
          <UnderlineTextWrapper>
            <TitleText
              fontSize={'18px'}
              text="1. To take part in an event you need to join it"
            />
            <UnderlineText>
              <TitleText fontSize={'18px'} text=" BEFORE " />
            </UnderlineText>
            <TitleText fontSize={'18px'} text="it’s starting." />
          </UnderlineTextWrapper>
        </TextWrapper>
        <TitleText
          fontSize={'18px'}
          text="2. The event will be open to join 3 hours before the start time."
        />
      </TextWrapper>
      <TextWrapper>
        <ExampleListText>
          <TitleText
            fontSize={'18px'}
            title={true}
            text="Example: An event starts at 18:00"
          />
        </ExampleListText>
        <TitleText fontSize={'18px'} text="You can join the event between" />
        <TitleText
          fontSize={'18px'}
          text="15:00 - 17:59 at the day of the event."
        />
      </TextWrapper>
    </View>
  );
};

HowCirclesWorksScreen.defaultProps = defaultProps;
HowCirclesWorksScreen.propTypes = propTypes;
