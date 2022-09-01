import React, { lazy } from 'react';
import './App.css';
import { Loadable } from './components/common/Loadable';
const RouterComponent = Loadable(lazy(() => import('./routes/Routes')));
function App() {
  return (
    <div className="App">
      <RouterComponent />
    </div>
  );
}

export default App;
