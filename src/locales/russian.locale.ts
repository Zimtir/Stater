import ILocale from '../interfaces/locale.interface'
import DarkTheme from '../themes/dark.theme'
import LightTheme from '../themes/light.theme'

export default class RussianLocale implements ILocale {
  short = 'ru'
  prefix = '🇷🇺Русский'
  author = {
    name: 'Создатель проекта',
    link: 'https://vk.com/the_homeless_god',
  }
  title = 'COVID-19'
  subtitle = 'COVID-19 статистика'
  total = {
    title: 'Мировая статистика',
    items: [
      { forms: ['страна', 'страны', 'стран'] },
      { forms: ['случай', 'случая', 'случаев'] },
      { forms: ['смерть', 'смерти', 'смертей'] },
      { forms: ['выздоровление', 'выздоровления', 'выздоровлений'] },
    ],
  }
  language = {
    change: 'Язык',
  }
  theme = {
    change: 'Тема оформления',
    dark: new DarkTheme('ru'),
    light: new LightTheme('ru'),
  }
}
