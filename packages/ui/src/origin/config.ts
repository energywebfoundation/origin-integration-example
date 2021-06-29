import { allOriginFeatures, OriginFeature } from '@energyweb/utils-general';
import { createMaterialThemeForOrigin } from './theme';
import { IOriginConfiguration } from '@energyweb/origin-ui-core';

const styleConfig = {
  PRIMARY_COLOR: '#894ec5',
  PRIMARY_COLOR_DARK: '#7b46b0',
  PRIMARY_COLOR_DIM: '#362c45',
  TEXT_COLOR_DEFAULT: '#a8a8a8',
  SIMPLE_TEXT_COLOR: '#ffffff',
  MAIN_BACKGROUND_COLOR: '#2c2c2c',
  FIELD_ICON_COLOR: '#e5e5e4',
  WHITE: '#FFF',
}

const sliderStyle = {
  root: {
    height: 3,
    padding: '13px 0'
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: styleConfig.MAIN_BACKGROUND_COLOR,
    border: '1px solid currentColor',
    marginTop: -12,
    marginLeft: -13,
    '& .bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 9px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: 'currentColor'
    },
    '.MuiSlider-root.Mui-disabled &': {
      left: 'calc(-50% - 9px)'
    }
  },
  track: {
    height: 3
  },
  rail: {
    color: styleConfig.MAIN_BACKGROUND_COLOR,
    opacity: 1,
    height: 3
  },
  mark: {
    backgroundColor: 'currentColor',
    height: 8,
    width: 1,
    marginTop: -3
  },
  markActive: {
    backgroundColor: 'currentColor'
  }
}

const originConfig: IOriginConfiguration = {
  // Styles for Material UI slider component. It can be empty object.
  customSliderStyle: sliderStyle,
  // Default language used by application, as a fallback
  defaultLanguage: 'en',
  // Language that will be used as primary
  language: 'en',
  // Enabled application features. As stated `allOriginFeatures` includes all available features
  enabledFeatures: allOriginFeatures.filter(feature => feature !== OriginFeature.IRec && feature !== OriginFeature.IRecConnect),
  // React component that will render login page background
  loginPageBg: () => null,
  // React component that will render application logo
  logo: () => null,
  // Material theme configuration
  materialTheme: createMaterialThemeForOrigin(styleConfig, 'en'),
  // Various color variables
  styleConfig,
};

export {
  originConfig,
};
