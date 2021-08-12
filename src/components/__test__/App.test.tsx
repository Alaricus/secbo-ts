import { render } from '@testing-library/react';
import App from '../App';

describe('<App />', () => {
  const { getByTestId, getByText } = render(<App />);
  const appElement = getByTestId('app');
  const headerElement = getByText('secbo-ts');
  const paragraphElement = getByText('v 1.2.1');

  it('should render without crashing', () => {
    expect(appElement).toBeVisible();
  });

  it('should contain the header', () => {
    expect(appElement).toContainElement(headerElement);
  });

  it('should contain the paragraph with the version', () => {
    expect(appElement).toContainElement(paragraphElement);
  });
});
