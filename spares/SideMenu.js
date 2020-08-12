import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-elements';
import MenuOverlay from '../components/MenuOverlay';

export default SideMenu = (props) => {
  const windowDim = useWindowDimensions();
  const baseStyles = windowDim && getBaseStyles(windowDim);

  let { navigation, onToggleMenu } = props;

  return (
    <View style={baseStyles.containerPanel}>
      <MenuOverlay onToggleMenu={onToggleMenu} navigation={navigation} />
      <View style={baseStyles.panelMenu}>
        <Text>Test</Text>
      </View>
    </View>
  );
};
