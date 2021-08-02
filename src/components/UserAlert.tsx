import { FC } from 'react';

type UserAlertProps = {
  message: string;
  dismiss: (str: string) => void;
}

const UserAlert: FC<UserAlertProps> = ({ message = '', dismiss }) => (
  <div className={`UserAlert ${message ? 'UaDescend' : ''}`}>
    {message}
    {
      message && <button type="button" className="Dismiss" onClick={() => dismiss('')}>×</button>
    }
  </div>
);

export default UserAlert;
