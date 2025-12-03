export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'neutral',
      neutral: 'neutral'
    },
    header: {
      slots: {
        center: 'flex lg:flex',
        container: 'mx-0 max-w-full'
      }
    },
    pageAside: {
      slots: {
        root: 'block'
      }
    }
  }
})