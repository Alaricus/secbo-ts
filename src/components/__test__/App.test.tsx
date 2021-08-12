import { render } from '@testing-library/react';
import App from '../App';

describe('<App />', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(<App />);
    const appElement = getByTestId('app');
    expect(appElement).toBeVisible();
  });
});
