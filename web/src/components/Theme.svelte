<script>
  import Select from 'svelte-select'
  import { onMount } from 'svelte'
  import { dictionary, theme } from '../stores/store.ts'
  import CommonTool from 'node-crud-kit/lib/tools/common.tool'

  let themes = []
  let items = []

  let selectedValue = undefined

  const getPreset = storeTheme => {
    let output = null

    let themeLocal = storeTheme
    if (CommonTool.isNonEmpty(theme)) {
      let founded = false
      themes.map(themeItem => {
        if (themeItem.short === themeLocal) {
          output = themeItem
          founded = true
        }
      })

      if (!founded) {
        output = $theme
      }
    } else {
      output = themes[0]
    }

    return output
  }

  const updatePreset = storeTheme => {
    let preset = getPreset(storeTheme)
    theme.set(preset)
    selectedValue = items.find(item => item.value === preset.short)
  }

  const handleSelect = event => {
    localStorage.setItem('theme', event.detail.value)
    updatePreset(localStorage.getItem('theme'))
  }

  dictionary.subscribe(value => {
    themes = [value.theme.light, value.theme.dark, value.theme.mountain]
    items = themes.map(themeItem => {
      return { value: themeItem.short, label: themeItem.prefix }
    })
    let preset = getPreset($theme)

    selectedValue = items.find(item => item.value === preset.short)
  })

  onMount(() => updatePreset(localStorage.getItem('theme')))
</script>

<Select
  containerStyles="min-width: 50px; margin: 10px; justify-content: center;"
  placeholder={$dictionary.theme.change}
  {items}
  on:select={handleSelect}
  isClearable={false}
  bind:selectedValue />
