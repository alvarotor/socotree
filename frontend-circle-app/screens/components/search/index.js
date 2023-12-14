import React, {Component} from 'react';
import {Platform} from 'react-native';
import {
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  LogBox,
} from 'react-native';
import {
  NameText,
  NameBoldText,
  BottomView,
  CloseIcon,
  CloseView,
  RoundView,
  NameView,
  ListItemIconWrapper,
  RoundSelectedView,
} from './styled';
import Icon from 'react-native-vector-icons/Ionicons';

const defaultItemValue = {
  name: '',
  id: 0,
};

export default class SearchableDropDown extends Component {
  static defaultProps = {
    minKeyLength: 1,
  };

  constructor(props) {
    super(props);
    this.renderTextInput = this.renderTextInput.bind(this);
    this.renderFlatList = this.renderFlatList.bind(this);
    this.searchedItems = this.searchedItems.bind(this);
    this.renderItems = this.renderItems.bind(this);

    this.state = {
      item: {},
      listItems: [],
      focus: true,
      isShowClose: '',
    };
  }

  componentDidMount = () => {
    const listItems = this.props.items;
    LogBox.ignoreAllLogs();
    const defaultIndex = this.props.defaultIndex;
    if (defaultIndex && listItems.length > defaultIndex) {
      this.setState({
        listItems,
        item: listItems[defaultIndex],
      });
    } else {
      this.setState({listItems});
    }
  };

  componentDidUpdate = (prevProps) => {
    const listItems = this.props.items;

    if (prevProps.items.length !== listItems.length) {
      this.setState({
        listItems,
        item: defaultItemValue,
      });
      this.searchedItems('');
    }
  };

  renderFlatList = () => {
    this.state.listItems.sort((a, b) => a.name.localeCompare(b.name));

    if (this.state.focus) {
      const flatListPorps = {...this.props.listProps};
      const oldSupport = [
        {key: 'keyboardShouldPersistTaps', val: 'always'},
        {key: 'nestedScrollEnabled', val: false},
        {key: 'style', val: {...this.props.itemsContainerStyle}},
        {key: 'data', val: this.state.listItems},
        {key: 'keyExtractor', val: (item, index) => index.toString()},
        {
          key: 'renderItem',
          val: ({item, index}) => this.renderItems(item, index),
        },
      ];
      oldSupport.forEach((kv) => {
        if (!Object.keys(flatListPorps).includes(kv.key)) {
          flatListPorps[kv.key] = kv.val;
        } else {
          if (kv.key === 'style') {
            flatListPorps.style = kv.val;
          }
        }
      });

      return <FlatList {...flatListPorps} />;
    }
  };

  searchedItems = (searchedText) => {
    this.setState({isShowClose: searchedText});

    if (
      searchedText.length > 0 &&
      searchedText.length < this.props.minKeyLength
    ) {
      this.setState({listItems: []});

      return;
    }

    let setSort = this.props.setSort;
    if (!setSort && typeof setSort !== 'function') {
      setSort = (item, srcText) => {
        return item.name.toLowerCase().startsWith(srcText.toLowerCase());
      };
    }
    let ac = this.props.items.filter((item) => {
      return setSort(item, searchedText);
    });

    let item = {
      id: -1,
      name: searchedText,
    };
    this.setState({listItems: ac, item: item});
    const onTextChange =
      this.props.onTextChange ||
      this.props.textInputProps.onTextChange ||
      this.props.onChangeText ||
      this.props.textInputProps.onChangeText;
    if (onTextChange && typeof onTextChange === 'function') {
      setTimeout(() => {
        onTextChange(searchedText, ac.length);
      }, 0);
    }
  };

  renderItems = (item, index) => {
    if (
      this.props.multi &&
      this.props.selectedItems &&
      this.props.selectedItems.length > 0
    ) {
      return this.props.selectedItems.find((sitem) => sitem.id === item.id) ? (
        <TouchableOpacity
          onPress={() =>
            setTimeout(() => {
              this.props.onRemoveItem(item, index);
            }, 0)
          }
          style={{
            ...this.props.itemStyle,
            flex: 1,
            flexDirection: 'row',
            height: 50,
          }}>
          <NameView>
            <NameBoldText>{item.name}</NameBoldText>
            <ListItemIconWrapper>
              <RoundSelectedView color={'#05EA00'}>
                <Icon size={25} color={'white'} name={'checkmark'} />
              </RoundSelectedView>
            </ListItemIconWrapper>
          </NameView>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            this.setState({item: item});
            setTimeout(() => {
              this.props.onItemSelect(item);
            }, 0);
          }}
          style={{
            ...this.props.itemStyle,
            flex: 1,
            flexDirection: 'row',
            height: 50,
          }}>
          <NameView>
            <NameText>{item.name}</NameText>
            <ListItemIconWrapper>
              <RoundView />
            </ListItemIconWrapper>
          </NameView>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{...this.props.itemStyle, height: 50}}
          onPress={() => {
            this.setState({item: item});
            Keyboard.dismiss();
            setTimeout(() => {
              this.props.onItemSelect(item);
              if (this.props.resetValue) {
                this.setState({focus: true, item: defaultItemValue});
              }
            }, 0);
          }}>
          {this.props.selectedItems &&
          this.props.selectedItems.length > 0 &&
          this.props.selectedItems.find((x) => x.id === item.id) ? (
            <View style={{...this.props.itemTextStyle}}>
              <NameText>{item.name}</NameText>
              <ListItemIconWrapper>
                <RoundView />
              </ListItemIconWrapper>
            </View>
          ) : (
            <View style={{...this.props.itemTextStyle}}>
              <NameText>{item.name}</NameText>
              <ListItemIconWrapper>
                <RoundView />
              </ListItemIconWrapper>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  };

  renderListType = () => {
    return this.renderFlatList();
  };

  renderTextInput = () => {
    const textInputProps = {...this.props.textInputProps};
    const oldSupport = [
      {key: 'ref', val: (e) => (this.input = e)},
      {
        key: 'onTextChange',
        val: (text) => {
          this.searchedItems(text);
        },
      },
      {key: 'underlineColorAndroid', val: this.props.underlineColorAndroid},
      {
        key: 'onFocus',
        val: () => {
          this.props.onFocus && this.props.onFocus();
          this.setState({
            focus: true,
            item: defaultItemValue,
            listItems: this.props.items,
          });
        },
      },
      {
        key: 'onBlur',
        val: () => {
          this.props.onBlur && this.props.onBlur();
        },
      },
      {
        key: 'value',
        val: this.state.isShowClose,
      },
      {
        key: 'style',
        val: {...this.props.textInputStyle},
      },
      {
        key: 'placeholderTextColor',
        val: this.props.placeholderTextColor,
      },
      {
        key: 'placeholder',
        val: this.props.placeholder,
      },
    ];
    oldSupport.forEach((kv) => {
      if (!Object.keys(textInputProps).includes(kv.key)) {
        if (kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps.onChangeText = kv.val;
        } else {
          textInputProps[kv.key] = kv.val;
        }
      } else {
        if (kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps.onChangeText = kv.val;
        }
      }
    });
    const textInputPropsStyles = [textInputProps.style];
    if (Platform.OS !== 'ios') {
      textInputPropsStyles.push({height: 42});
    }
    return (
      <>
        <CloseView>
          <Icon size={30} name={'search'} />
          <TextInput {...textInputProps} style={textInputPropsStyles} />
          {this.state.isShowClose ? (
            <Icon
              onPress={() =>
                this.setState({isShowClose: false, listItems: this.props.items})
              }
              size={30}
              name={'close-circle'}
            />
          ) : null}
        </CloseView>
        <BottomView />
      </>
    );
  };

  render = () => {
    return (
      <View
        keyboardShouldPersist="always"
        style={{...this.props.containerStyle}}>
        {this.renderTextInput()}
        {this.renderListType()}
      </View>
    );
  };
}
