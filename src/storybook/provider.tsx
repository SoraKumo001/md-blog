import { ReactNode } from 'react';
import { Provider } from 'urql';
import { fromValue } from 'wonka';

type Props = { value?: object; children: ReactNode };

export const MockProvider = ({ children, value }: Props) => {
  const queryValue = {
    executeQuery: () => {
      return fromValue({
        data: value,
      });
    },
  };

  return <Provider value={queryValue as never}>{children}</Provider>;
};
