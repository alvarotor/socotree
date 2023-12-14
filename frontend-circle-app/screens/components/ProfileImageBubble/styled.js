import styled from 'styled-components/native';

export const MainViewWrapper = styled.View`
  width: 110%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ColorViewWrapper = styled.View`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  background-color: ${(props) => props.color};
`;

export const ImageWrapper = styled.Image`
  height: 100%;
  width: 100%;
  border-radius: 40px;
`;

export const ImageViewWrapper = styled.View`
  height: 110px;
  width: 110px;
  border-radius: 40px;
  background: ${(props) => props.color};
  align-items: center;
  justify-content: center;
`;
