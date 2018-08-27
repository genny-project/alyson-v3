import React from 'react';

import { storiesOf } from '@storybook/react';
import { Button } from '../src/views/components';

storiesOf( 'Button', module )
  .add( 'with text', () => (
    <Button>
      Hello Button
    </Button>
  ));
