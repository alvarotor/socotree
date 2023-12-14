import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, Alert} from 'react-native';
import {defaultProps, propTypes} from '../components/props';
import {
  MainViewWrapper,
  InputFieldWrapper,
  InnerView,
  ButtonWrapper,
  Separator,
  GrayBar,
  GreenBar,
} from '../components/GlobalStyles';
import {
  SelectButtonContainer,
  SelectButton,
  SelectText,
  // IconWrapper,
  // LeftIconWrapper,
  // RightIconWrapper,
  // IconStyled,
} from './styled';
import {AppHeader} from '../components/app-header';
import {TitleText} from '../components/title-text';
import {Button} from '../components/button';
import {Template} from '../components/keyboard-safe-view';
import {
  questions as qRead,
  createUserAnswers,
  // deleteUserAnswer,
  setMyAnswers,
} from '../../core';
// import ENV from '../../active.env';
import {UserContext} from '../UserContext';
import {trackScreen} from '../segment';

export const QuestionsScreen = ({navigation, route}) => {
  const {settings} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [questionIndex, setIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  // const [allAnswered, setAllAnswered] = useState(ENV !== 'dev' ? false : true);

  useEffect(() => {
    trackScreen('Questions', user.userid);

    const getQuestions = async () => {
      const qSaved = await qRead();
      const qAnswers = await setMyAnswers(qSaved, user.token);
      setQuestions(qAnswers);
    };

    getQuestions();
  }, [user.token, user.userid]);

  const updateQuestionsStates = () => {
    if (questionIndex !== questions.length - 1) {
      setTimeout(() => {
        setIndex(questionIndex + 1);
      }, 100);
    }
    // console.log(questions);
    // console.log(questions.length - 1);
    // console.log(questions[questions.length - 1]);
    // if (questions[questions.length - 1].selectedAnswer) {
    //   setAllAnswered(true);
    // }
  };

  const onSelectAnswer = (index, key) => {
    const modifiedQuestions = [...questions];
    if (modifiedQuestions[index].selectedAnswer) {
      if (modifiedQuestions[index].selectedAnswer === key) {
        modifiedQuestions[index].selectedAnswer = null;
        // setAllAnswered(false);
      } else {
        modifiedQuestions[index].selectedAnswer = key;
        updateQuestionsStates();
      }
    } else {
      modifiedQuestions[index].selectedAnswer = key;
      updateQuestionsStates();
    }
    setQuestions(modifiedQuestions);
  };

  // const chooseBack = () => {
  //   // console.log(questionIndex);
  //   if (questionIndex !== 0) {
  //     setIndex(questionIndex - 1);
  //   }
  // };

  const chooseFront = () => {
    // console.log(questionIndex);
    // console.log(questions.length - 1);
    if (questionIndex !== questions.length - 1) {
      setTimeout(() => {
        setIndex(questionIndex + 1);
        updateQuestionsStates();
      }, 300);
    }
  };

  const updateUser = (u) => {
    const updatedUser = {
      ...u,
      answers: Date.now(),
    };
    setUser(updatedUser);
  };

  const onPressContinue = async () => {
    const myAnswersFiltered = questions.filter(
      (finalQ) => finalQ.selectedAnswer,
    );

    const myAnswers = myAnswersFiltered.map((finalQ) => {
      return {
        AnswerID: finalQ.selectedAnswer,
        QuestionID: finalQ.uuid,
      };
    });

    // console.log(myAnswersFiltered);
    // console.log('myAnswers', myAnswers);

    // myAnswers.map(async (a) => {
    //   console.log(a);
    //   if (!(await deleteUserAnswer(user.token, a.QuestionID))) {
    //     Alert.alert(
    //       'Questions',
    //       'There was a problem cleaning your old answers, please try again.',
    //     );
    //     return;
    //   }
    // });

    // console.log(JSON.stringify(myAnswers).replace(/"/g, "'"));
    if (
      !(await createUserAnswers(
        user.token,
        JSON.stringify(myAnswers).replace(/"/g, "'"),
      ))
    ) {
      Alert.alert(
        'Questions',
        'There was a problem saving your answers, please try again.',
      );
      return;
    }

    updateUser(user);
    if (settings) {
      navigation.navigate('EditProfile');
    } else {
      navigation.navigate('UploadPhoto', {settings: false});
    }
  };

  return (
    <Template>
      <MainViewWrapper>
        {!settings ? (
          <GrayBar>
            <GreenBar width={(100 / 6) * 5} />
          </GrayBar>
        ) : null}
        <AppHeader navigation={navigation} />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            {questions
              ? questions.map((qDisplay, index) => {
                  if (questionIndex === index) {
                    return (
                      <InputFieldWrapper key={qDisplay.uuid}>
                        <TitleText
                          title={true}
                          fontSize={'18px'}
                          text={`Question ${index + 1} of ${questions.length}`}
                        />
                        <Separator />
                        <TitleText
                          title={true}
                          text={qDisplay.question}
                          fontSize={'40px'}
                        />
                        <Separator />
                        <SelectButtonContainer>
                          {qDisplay.answers.map((res) => {
                            return (
                              <SelectButton
                                key={res.uuid}
                                backgroundColor={
                                  qDisplay.selectedAnswer === res.uuid
                                    ? '#010101'
                                    : '#f0f0f0'
                                }
                                onPress={() => onSelectAnswer(index, res.uuid)}>
                                <SelectText
                                  color={
                                    qDisplay.selectedAnswer === res.uuid
                                      ? '#f0f0f0'
                                      : '#010101'
                                  }>
                                  {res.answer}
                                </SelectText>
                              </SelectButton>
                            );
                          })}
                        </SelectButtonContainer>
                      </InputFieldWrapper>
                    );
                  }
                })
              : null}
            {/* <IconWrapper>
              <LeftIconWrapper>
                <TouchableOpacity
                  onPress={() => chooseBack()}
                  disabled={questionIndex === 0}>
                  <IconStyled name="arrowleft" />
                </TouchableOpacity>
              </LeftIconWrapper>
              <RightIconWrapper>
                <TouchableOpacity
                  onPress={() => chooseFront()}
                  disabled={questionIndex === questions.length - 1}>
                  <IconStyled name="arrowright" iconStyles={'0'} />
                </TouchableOpacity>
              </RightIconWrapper>
            </IconWrapper> */}
          </ScrollView>
          <ButtonWrapper>
            {/* <Button
              buttonText="Continue"
              onPress={() => onPressContinue()}
              disabled={!allAnswered}
            /> */}
            <Button
              buttonText={
                questionIndex === questions.length - 1 ? 'Continue' : 'Next'
              }
              onPress={() =>
                questionIndex === questions.length - 1
                  ? onPressContinue()
                  : chooseFront()
              }
            />
          </ButtonWrapper>
        </InnerView>
      </MainViewWrapper>
    </Template>
  );
};

QuestionsScreen.defaultProps = defaultProps;
QuestionsScreen.propTypes = propTypes;
