// import React from 'react';
import CounterComponent from './features/counter/CounterComponent';
import LoginFormModal from './components/LoginFormPage/LoginFormModal';

function App() {
  return (
    <div>
      <h1>Cozy Cabins</h1>
      <LoginFormModal />
      <CounterComponent />
    </div>
  );
}

export default App;
