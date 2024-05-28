import config from '~/configs';
import Home from '~/pages/Home';
import List from '~/pages/List';
import Login from '~/pages/Login';
import Preview from '~/pages/Preview';

const publicRoutes: {}[] = [{ path: config.routes.login, component: Login }];
const privateRoutes: {}[] = [
  { path: config.routes.home, component: List },
  // { path: config.routes.list, component: List },
  // { path: config.routes.viewqr, component: Preview },
];
const generalRoutes: {}[] = [{ path: config.routes.viewqr, component: Preview }];

export { publicRoutes, privateRoutes, generalRoutes };
