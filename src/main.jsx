import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import 'animate.css';
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator) {
    registerSW({
        onNeedRefresh() {
            console.log('New content available, click on reload button to update.')
        },
        onOfflineReady() {
            console.log('App ready to work offline')
        },
    })
}

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
);
