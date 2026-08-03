import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '6xwkvttc',
    dataset: 'production',
  },
  // Fija el hostname del Studio publicado → https://ffchocolates.sanity.studio
  // (evita el prompt interactivo en `sanity deploy`).
  studioHost: 'ffchocolates',
  deployment: {
    appId: 'yuhoyamtckdm6iq2k62ymyn6',
  },
  autoUpdates: true,
})
