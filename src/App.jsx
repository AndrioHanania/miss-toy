import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react';

const ToyIndex = lazy(() => import('./pages/ToyIndex'))
const ToyEdit = lazy(() => import('./pages/ToyEdit'))

import { AppFooter } from './components/AppFooter'
import { AppHeader } from './components/AppHeader'
import { UserMsg } from './components/UserMsg'
import { ThemeProvider } from './contexts/ThemeContext';
import { AppContainer } from './components/AppContainer';
import { Home } from './pages/Home';
import { DynamicModal } from './components/DynamicModal';

function withSuspense(Cmp, fallback = <div >Loading...</div>) {
  return (
      <Suspense fallback={fallback}>
          <Cmp />
      </Suspense>
  )
}


function App() {
  return (
    <Router>
      <section id="app" className="main-layout">
        <ThemeProvider>
          <AppHeader />
            <AppContainer>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/toy" element={withSuspense(ToyIndex)} >
                  <Route path='/toy/edit/:toyId?' element={withSuspense(ToyEdit)} />
                </Route>
              </Routes>
            </AppContainer>
          <AppFooter />
          <UserMsg/>
          <DynamicModal />
        </ThemeProvider>
      </section>
    </Router>
  )
}

export default App
