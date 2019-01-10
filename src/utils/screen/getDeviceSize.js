import { Dimensions } from 'react-native-web';
import { SMALL_SCREEN, MEDIUM_SCREEN } from '../../constants';

const getDeviceSize = () => {
  const windowDimensions = Dimensions.get( 'window' );

  return windowDimensions.width <= SMALL_SCREEN
    ? 'sm'
    : ( windowDimensions.width > SMALL_SCREEN && windowDimensions.width <= MEDIUM_SCREEN )
      ? 'md'
      : windowDimensions.width >= MEDIUM_SCREEN
        ? 'lg'
        : 'undefined';
};

export default getDeviceSize;
