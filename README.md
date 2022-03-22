# With dark theme

This example demonstrates how to add dark theme to your react project

## **Why?**

Темная тема стала стандартом де-факто последнее время. Часто это может стать причиной отказа от использования сайтом. Особенно если его используют программисты, которые сплошь и рядом работают в тёмной теме.

## **How?**

Я покажу, как добавить темную тему в React проект. Разберем основные моменты и сделаем всё красиво.

## **What?**

В кратце так.

1. Создадим create-react-app проект

2. Добавим контекст с переключателем темы

3. Объявим переменные для каждой темы

Итак, поехали:

1. С помощью `cra` создаем проект и сразу добавляем `sass` для удобства работы со стилями

```bash
> npx create-react-app with-dark-theme
> cd with-dark-theme
> npm i sass -S
```

2. Удалим ненужные файлы

```bash
> cd src
> rm App.css App.js App.test.js index.css logo.svg
```

1. Создадим удобную структур

```bash
# внутри src/
> mkdir -p components/{Root,Toggle} contexts providers
> touch index.scss components/Root/index.js components/Toggle/{index.js,index.module.scss} contexts/ThemeContext.js providers/ThemeProvider.js
```

Должна получиться такая структура внутри `src/`

```bash
src
├── components
│   ├── Root
│   │   └── index.js
│   └── Toggle
│       ├── index.js
│       └── index.module.scss
├── contexts
│   └── ThemeContext.js
├── providers
│   └── ThemeProvider.js
├── index.js
├── index.scss
└── ...
```

Поскольку мы внесли изменения в структуру, то изменим `index.js`

```jsx
// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'

import Root from './components/Root' // теперь точка входа у нас не App, а Root

import './index.scss' // поменяли css на scss

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
)
```

```jsx
// src/components/Root/index.js

import React from 'react'

const Root = () => (
	<div>There are will be Dark Theme</div>
)

export default Root
```

Проект уже запускается, но никакой темной темы пока еще нет.

Давайте добавим ее!

Делается это через контекст. В `ThemeContext.js` и `ThemeProvider.js` напишем следующий код:

```jsx
// src/contexts/ThemeContext.js
import React from 'react'

export const themes = {
  dark: 'dark',
  light: 'light',
}

export const ThemeContext = React.createContext({})
```

```jsx
// src/providers/ThemeProvider.js
import React from 'react'
import { ThemeContext, themes } from 'src/contexts/ThemeContext'

const getTheme = () => {
  const theme = `${window?.localStorage?.getItem('theme')}`
  if (Object.values(themes).includes(theme)) return theme

  const userMedia = window.matchMedia('(prefers-color-scheme: light)')
  if (userMedia.matches) return themes.light

  return themes.dark
}

const ThemeProvider = ({ children }) => {
  const [ theme, setTheme ] = React.useState(getTheme)

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [ theme ])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
```

И добавим его в `index.js`

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'

import ThemeProvider from './providers/ThemeProvider' // +
import Root from './components/Root'

import './index.scss'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
...
```

Осталось научить приложение менять тему. Воспользуемся тогглером

```jsx
// src/components/Toggle/index.js
import React from 'react'
import styles from './index.module.scss'

const Toggle = ({ value, onChange }) => (
  <label className={styles.switch} htmlFor="toggler">
    <input
      id="toggler"
      type="checkbox"
      onClick={onChange}
      checked={value}
      readOnly
    />
    <span className={styles.slider} />
    <span className={styles.wave} />
  </label>
)

export default Toggle
```

```scss
.root {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 50px;
  transform: translate(-50%, -50%);
  input {
    display: none;
  }
  .wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 50px;
    border-radius: 40px;
    &:after {
      content: "";
      position: absolute;
      top: 3px;
      left: 20%;
      width: 60px;
      height: 3px;
      background: #ffffff;
      border-radius: 100%;
      opacity: 0.4;
    }
    &:before {
      content: "";
      position: absolute;
      top: 10px;
      left: 30%;
      width: 35px;
      height: 2px;
      background: #ffffff;
      border-radius: 100%;
      opacity: 0.3;
    }
  }
  .slider {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    overflow: hidden;
    background-color: #e74a42;
    border-radius: 50px;
    cursor: pointer;
    transition: all 1.4s;
    &:before,
    &:after {
      content: "";
      position: absolute;
      bottom: 5px;
      left: 5px;
      width: 40px;
      height: 40px;
      background-color: #ffffff;
      border-radius: 30px;
    }
    &:before {
      transition: 0.4s;
    }
    &:after {
      transition: 0.5s;
    }
  }
  input:checked + .slider {
    background-color: transparent;
    &:before,
    &:after {
      transform: translateX(70px);
    }
  }
  input:checked ~ .wave {
    display: block;
    background-color: #3398d9;
  }
}
```

И теперь добавим тогл на главную страницу

```jsx
import React from 'react'
import { ThemeContext, themes } from '../../contexts/ThemeContext'
import Toggle from '../Toggle'

const Root = () => (
  <ThemeContext.Consumer>
    {({ theme, setTheme }) => (
      <Toggle
        onChange={() => {
          if (theme === themes.light) setTheme(themes.dark)
          if (theme === themes.dark) setTheme(themes.light)
        }}
        value={theme === themes.dark}
      />
    )}
  </ThemeContext.Consumer>
)

export default Root
```
