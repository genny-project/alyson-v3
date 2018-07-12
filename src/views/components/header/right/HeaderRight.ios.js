import React from 'react';
import { Platform } from 'react-native';
import { string, bool, arrayOf, shape } from 'prop-types';
import { isArray } from '../../../../utils';
import { Box } from '../../index';
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
          marginRight={10}
          alignItems="center"
        >
          {isArray( filteredItems, { ofMinLength: 1 }) ? (
            filteredItems.map( item => (
              <HeaderItem
                {...item}
                key={item.id}
                href={item.href}
                icon={item.icon}
                eventType={item.eventType}
                buttonCode={item.buttonCode}
                textColor={textColor}
              />
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
