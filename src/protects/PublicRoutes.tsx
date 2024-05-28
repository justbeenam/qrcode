import { ReactNode, memo } from 'react';
import { Navigate } from 'react-router-dom';
import config from '~/configs';

function PublicRoutes({ user, children }: PublicRoutesProps) {
  return user.uid === '' || user.role !== 1 ? children : <Navigate to={config.routes.home} />;
}

export default memo(PublicRoutes);
interface PublicRoutesProps {
  user: any;
  children: ReactNode;
}
