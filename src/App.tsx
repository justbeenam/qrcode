import { Fragment } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { useAuthContext } from './contexts/AuthContextProvider';
import MainLayout from './layouts/MainLayout';
import PrivatedRoutes from './protects/PrivatedRoutes';
import { generalRoutes, privateRoutes, publicRoutes } from './routes';
import PublicRoutes from './protects/PublicRoutes';
function App() {
  const { currentUser } = useAuthContext();

  return (
    <Router>
      <Routes>
        {publicRoutes.map((route: any, index: number) => {
          let Layout: any = MainLayout;
          if (route.layout !== null) {
            Layout = route.layout ? route.layout : MainLayout;
          } else {
            Layout = Fragment;
          }
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <PublicRoutes user={currentUser}>
                    <Page />
                  </PublicRoutes>
                </Layout>
              }
            />
          );
        })}
        {privateRoutes.map((route: any, index: number) => {
          let Layout: any = MainLayout;
          if (route.layout !== null) {
            Layout = route.layout ? route.layout : MainLayout;
          } else {
            Layout = Fragment;
          }
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <PrivatedRoutes user={currentUser}>
                    <Page />
                  </PrivatedRoutes>
                </Layout>
              }
            />
          );
        })}
        {generalRoutes.map((route: any, index: number) => {
          let Layout: any = MainLayout;
          if (route.layout !== null) {
            Layout = route.layout ? route.layout : MainLayout;
          } else {
            Layout = Fragment;
          }
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
