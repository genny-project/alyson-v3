import React from 'react';
import { Platform } from 'react-native';
import { arrayOf, bool, string, shape } from 'prop-types';
import { Box, Dropdown } from '../../index';
import { isArray } from '../../../../utils';
import { LayoutConsumer } from '../../../layout';
import HeaderItem from '../item';

const handleFilterItem = item => {
  if (
    isArray( item.platforms, { ofMinLength: 1 }) &&
    !item.platforms.includes( Platform.OS )
  ) {
    return false;
  }

  return true;
};

const HeaderRight = ({ items }) => {
  const filteredItems = isArray( items ) && items.filter( handleFilterItem );

  return (
    <LayoutConsumer>
      {({ textColor }) => (
        <Box
          paddingX={5}
          alignItems="center"
        >
          {isArray( filteredItems, { ofMinLength: 1 }) ? (
            filteredItems.map( item => (
              item.dropdown ? (
                <Dropdown
                  {...item}
                  padding={0}
                  paddingX={5}
                  textColor={textColor}
                  text={item.text}
                  facingRight
                  items={item.items.filter( handleFilterItem )}
                />
              ) : (
                <HeaderItem
                  {...item}
                  key={item.id}
                  href={item.href}
                  icon={item.icon}
                  eventType={item.eventType}
                  buttonCode={item.buttonCode}
                  textColor={textColor}
                />
              )
            ))
          ) : null}
        </Box>
      )}
    </LayoutConsumer>
  );
};

const headerItemPropTypes = shape({
  icon: string,
  href: string,
  text: string,
  dropdown: bool,
  items: arrayOf( headerItemPropTypes ),
});

HeaderRight.propTypes = {
  items: arrayOf( headerItemPropTypes ),
};

export default HeaderRight;
