import React from 'react';
import {defaultProps, propTypes} from './props';
import {
  MainViewWrapper,
  StatusBarWrapper,
  TitleText,
  TimeWrapper,
  ClockIconStyled,
  MatchText,
  ClockWrapper,
  TimeText,
} from './styled';
import StatusBarColor from '../../components/statusBar';

export const EventHeader = ({title, time, backgroundColor}) => {
  return (
    <MainViewWrapper backgroundColor={backgroundColor}>
      <StatusBarWrapper>
        <StatusBarColor backgroundColor={backgroundColor} />
      </StatusBarWrapper>
      {time !== '00:00' ? (
        <TimeWrapper>
          <MatchText>{title}</MatchText>
          <ClockWrapper>
            <ClockIconStyled name="clockcircleo" />
            <TimeText>{time}</TimeText>
          </ClockWrapper>
        </TimeWrapper>
      ) : (
        <TitleText>{title}</TitleText>
      )}
    </MainViewWrapper>
  );
};

EventHeader.defaultProps = defaultProps;
EventHeader.propTypes = propTypes;
