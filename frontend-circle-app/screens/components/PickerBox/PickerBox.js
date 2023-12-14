import React, {useState} from 'react';
import {defaultProps, propTypes} from './props';
import {
  ButtonViewWrapper,
  ButtonText,
  ImageFlag,
  DropDownText,
  DropDownMenu,
  TouchableOpacity,
  IconStyled,
} from './styled';

export const PickerBox = (props) => {
  const [showOption, setShowOption] = useState(false);

  const toggleOptions = () => {
    setShowOption(!showOption);
  };

  const selectValue = (index) => {
    toggleOptions();
    props.onChange(index);
  };

  const getPicker = () => {
    return (
      <DropDownMenu>
        {props.options.map((val, index) => {
          return (
            <TouchableOpacity onPress={() => selectValue(index)} key={index}>
              <DropDownText BottomBorderOnly={props.BottomBorderOnly}>
                {val.label}
              </DropDownText>
            </TouchableOpacity>
          );
        })}
      </DropDownMenu>
    );
  };

  return (
    <>
      <ButtonViewWrapper
        onPress={() => toggleOptions()}
        BottomBorderOnly={props.BottomBorderOnly}>
        {props.image ? <ImageFlag source={{uri: props.image}} /> : null}
        <ButtonText BottomBorderOnly={props.BottomBorderOnly}>
          {props.value ? props.value : 'Select'}
        </ButtonText>
        {!props.BottomBorderOnly && <IconStyled name="arrowdown" />}
      </ButtonViewWrapper>
      {showOption && getPicker()}
    </>
  );
};

PickerBox.defaultProps = defaultProps;
PickerBox.propTypes = propTypes;
