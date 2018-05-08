import React from 'react';
import { oneOf, number } from 'prop-types';
import range from 'lodash.range';
import { Icon } from '../../components';

const Ratings = ({
  numberOfStars = 5,
  rating = 0,
}) => (
  range( numberOfStars )
    .map( i => (
      <Icon
        key={i}
        name={(
          rating >= i
          ? 'star'
          : rating - 0.5 >= i
            ? 'star_half'
            : 'star_border'
        )}
      />
    ))
);

Ratings.propTypes = {
  numberOfStars: number,
  rating: oneOf(
    [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  ),
};

export default Ratings;
