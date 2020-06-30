module.exports = {
  indexPath: 'oui.html',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/ubus': {
        target: 'http://192.168.1.1'
      },
      '/cgi-bin/': {
        target: 'http://192.168.1.1'
      },
      '/views/': {
        target: 'http://192.168.1.1'
      },
      '/i18n/': {
        target: 'http://192.168.1.1'
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}