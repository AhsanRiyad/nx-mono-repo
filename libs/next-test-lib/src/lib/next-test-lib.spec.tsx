import { render } from '@testing-library/react';

import NextTestLib from './next-test-lib';

describe('NextTestLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NextTestLib />);
    expect(baseElement).toBeTruthy();
  });
});
