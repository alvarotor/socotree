import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, Alert} from 'react-native';
import {defaultProps, propTypes} from '../../components/props';
import {
  MainViewWrapper,
  InputFieldWrapper,
  InnerView,
  ButtonWrapper,
  Separator,
  GrayBar,
  GreenBar,
} from '../../components/GlobalStyles';
import {
  SelectButtonContainer,
  SelectButton,
  SelectText,
  // IconWrapper,
  // LeftIconWrapper,
  // RightIconWrapper,
  // IconStyled,
} from '../../Questions/styled';
import {AppHeader} from '../../components/app-header';
import {TitleText} from '../../components/title-text';
import {Button} from '../../components/button';
import {Template} from '../../components/keyboard-safe-view';
import {
  createUserAnswers,
  // deleteUserAnswer,
  setMyAnswersEvent,
} from '../../../core';
import {UserContext} from '../../UserContext';
import {trackScreen} from '../../segment';

export const QuestionsEventScreen = ({navigation, route}) => {
  const {eventquestion, id} = route.params;
  const {user, setUser} = useContext(UserContext);

  if (!user || user === {} || !user.token || !user.profile) {
    navigation.navigate('Start');
  }

  const [questionIndex, setIndex] = useState(0);
  const [questions, setQuestions] = useState(eventquestion);
  // const [allAnswered, setAllAnswered] = useState(false);

  useEffect(() => {
    trackScreen('EventQuestions', user.userid);
  }, [user.userid]);

  useEffect(() => {
    const getQuestions = async () => {
      const qAnswers = await setMyAnswersEvent(eventquestion, user.token);
      // console.log('qAnswers[0].question', qAnswers[0].question);
      setQuestions(qAnswers);
    };

    getQuestions();
  }, [user.token, eventquestion]);

  // const chooseBack = () => {
  //   if (questionIndex !== 0) {
  //     setIndex(questionIndex - 1);
  //   }
  // };

  const chooseFront = () => {
    updateQuestionsStates();
  };

  const updateQuestionsStates = () => {
    if (questionIndex !== questions.length - 1) {
      setTimeout(() => {
        setIndex(questionIndex + 1);
      }, 100);
    }

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

  const updateUser = (u) => {
    const updatedUser = {
      ...u,
      answers: Date.now(),
    };
    setUser(updatedUser);
  };

  const onPressContinue = async () => {
    // const myAnswersFiltered = questions.filter(
    //   (finalQ) => finalQ.selectedAnswer,
    // );

    const myAnswers = questions.map((finalQ) => {
      return {
        AnswerID: finalQ.selectedAnswer,
        QuestionID: finalQ.questionid,
      };
    });

    // console.log(myAnswersFiltered);
    // console.log('myAnswers', myAnswers);

    // myAnswers.map(async (a) => {
    //   if (!(await deleteUserAnswer(user.token, a.QuestionID))) {
    //     Alert.alert(
    //       'Questions',
    //       'There was a problem cleaning your old answers, please try again.',
    //     );
    //     return;
    //   }
    // });

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
    navigation.navigate('Event', {id});
  };

  return (
    <Template>
      <MainViewWrapper>
        <GrayBar>
          <GreenBar width={(100 / questions.length) * (questionIndex + 1)} />
        </GrayBar>
        <AppHeader navigation={navigation} />
        <InnerView>
          <ScrollView showsVerticalScrollIndicator={false}>
            {questions.map((q, index) => {
              // console.log(q);
              if (questionIndex === index) {
                return (
                  <InputFieldWrapper key={q.questionid}>
                    <TitleText
                      title={true}
                      fontSize={'18px'}
                      text={`Question ${index + 1} of ${questions.length}`}
                    />
                    <Separator />
                    <TitleText
                      title={true}
                      text={q.question.question}
                      fontSize={'40px'}
                    />
                    <Separator />
                    <SelectButtonContainer>
                      {q.question.answers.map((a) => {
                        // console.log(a);
                        return (
                          <SelectButton
                            key={a.uuid}
                            backgroundColor={
                              q.selectedAnswer === a.uuid
                                ? '#010101'
                                : '#f0f0f0'
                            }
                            onPress={() => onSelectAnswer(index, a.uuid)}>
                            <SelectText
                              color={
                                q.selectedAnswer === a.uuid
                                  ? '#f0f0f0'
                                  : '#010101'
                              }>
                              {a.answer}
                            </SelectText>
                          </SelectButton>
                        );
                      })}
                    </SelectButtonContainer>
                  </InputFieldWrapper>
                );
              }
            })}
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

QuestionsEventScreen.defaultProps = defaultProps;
QuestionsEventScreen.propTypes = propTypes;
