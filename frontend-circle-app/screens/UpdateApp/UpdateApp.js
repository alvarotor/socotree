import React, {useContext, useEffect} from 'react';
import {ScreenHeaderShape} from '../components/screen-header-shape';
import {
  SafeAreaViewWrapper,
  Body,
  ListSection,
  SectionTitle,
  ListText,
} from '../components/GlobalStyles';
import {List} from './styled';
import {AppHeader} from '../components/app-header';
import {UserContext} from '../UserContext';
import {trackScreen} from '../segment';

export const UpdateAppScreen = () => {
  const {user} = useContext(UserContext);

  useEffect(() => {
    trackScreen('UpdateApp', user?.userid);
  });

  return (
    <SafeAreaViewWrapper>
      <AppHeader backgroundColor={'#f2fff2'} leftButton={{isHidden: true}} />
      <ScreenHeaderShape titleText={'Update Circles'} />
      <SafeAreaViewWrapper>
        <Body>
          <ListSection>
            <SectionTitle>Update your App</SectionTitle>
            <List>
              <ListText>
                Sorry, you cant carry on without updating the app.
              </ListText>
            </List>
          </ListSection>
        </Body>
      </SafeAreaViewWrapper>
    </SafeAreaViewWrapper>
  );
};
