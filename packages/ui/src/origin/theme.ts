/* eslint-disable @typescript-eslint/naming-convention */
import { createMuiTheme, Theme } from '@material-ui/core';
import { plPL, enUS } from '@material-ui/core/locale';
import {
    ORIGIN_LANGUAGE,
} from '@energyweb/localization';
import { LightenColor, IOriginStyleConfig } from '@energyweb/origin-ui-core';

export const createMaterialThemeForOrigin = (
  styleConfig: IOriginStyleConfig,
  language: ORIGIN_LANGUAGE
): Theme => {
  const materialLocale =
      {
          pl: plPL,
          en: enUS
      }[language] ?? enUS;

  return createMuiTheme(
      {
          palette: {
              primary: {
                  main: styleConfig.PRIMARY_COLOR,
                  contrastText: styleConfig.WHITE
              },
              background: {
                  paper: styleConfig.MAIN_BACKGROUND_COLOR,
                  default: '#f44336'
              },
              text: {
                  primary: styleConfig.WHITE,
                  secondary: styleConfig.TEXT_COLOR_DEFAULT,
                  hint: '#f50057',
                  disabled: styleConfig.TEXT_COLOR_DEFAULT
              }
          },
          overrides: {
              MuiInput: {
                  underline: {
                      '&:before': {
                          borderBottom: `2px solid ${LightenColor(
                              styleConfig.MAIN_BACKGROUND_COLOR,
                              13
                          )}`
                      }
                  }
              },
              MuiFormLabel: {
                  root: { fontSize: '14px' }
              },
              MuiChip: {
                  root: {
                      marginRight: '10px'
                  }
              },
              MuiPaper: {
                  root: {
                      backgroundColor: styleConfig.MAIN_BACKGROUND_COLOR,
                      color: styleConfig.TEXT_COLOR_DEFAULT
                  }
              },
              MuiButton: {
                  contained: {
                      '&.Mui-disabled': {
                          color: styleConfig.TEXT_COLOR_DEFAULT
                      }
                  }
              },
              MuiTable: {
                  root: {
                      color: styleConfig.TEXT_COLOR_DEFAULT,
                      borderBottom: `2px solid ${styleConfig.PRIMARY_COLOR}`,
                      backgroundColor: styleConfig.MAIN_BACKGROUND_COLOR
                  }
              },
              MuiTableHead: {
                  root: {
                      '& > .MuiTableRow-root': {
                          background: LightenColor(styleConfig.MAIN_BACKGROUND_COLOR, 0.5)
                      }
                  }
              },
              MuiTableRow: {
                  root: {
                      background: LightenColor(styleConfig.MAIN_BACKGROUND_COLOR, 3.5),
                      '&:nth-child(even)': {
                          background: LightenColor(styleConfig.MAIN_BACKGROUND_COLOR, 0.5)
                      }
                  },
                  footer: {
                      background: LightenColor(styleConfig.MAIN_BACKGROUND_COLOR, 0.5)
                  }
              },
              MuiTableCell: {
                  root: {
                      borderBottom: `1px solid ${styleConfig.MAIN_BACKGROUND_COLOR}`,
                      fontSize: '14px'
                  },
                  body: {
                      color: styleConfig.TEXT_COLOR_DEFAULT
                  },
                  head: {
                      color: styleConfig.TEXT_COLOR_DEFAULT,
                      borderBottom: 'none'
                  }
              },
              MuiTableSortLabel: {
                  root: {
                      color: styleConfig.TEXT_COLOR_DEFAULT
                  }
              },
              MuiSelect: {
                  root: {
                      color: styleConfig.SIMPLE_TEXT_COLOR
                  },
                  icon: {
                      color: styleConfig.FIELD_ICON_COLOR
                  }
              },
              MuiMenuItem: {
                  root: {
                      color: styleConfig.SIMPLE_TEXT_COLOR
                  }
              },
              MuiTypography: {
                  root: {
                      color: styleConfig.SIMPLE_TEXT_COLOR
                  },
                  h5: {
                      fontFamily: styleConfig.SIMPLE_TEXT_COLOR
                  },
                  body1: {
                      fontFamily: styleConfig.SIMPLE_TEXT_COLOR
                  }
              },
              MuiTooltip: {
                  tooltip: {
                      backgroundColor: styleConfig.PRIMARY_COLOR
                  }
              }
          }
      },
      materialLocale,
      {
          typography: {
              fontSizeSm: 10,
              fontSizeMd: 12,
              fontSizeLg: 24
          }
      }
  );
};