import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'REEMPLAZAR_PROJECT_ID',
    dataset: 'production',
  },
  // Fija el hostname del Studio publicado → https://ffchocolates.sanity.studio
  // (evita el prompt interactivo en `sanity deploy`).
  studioHost: 'ffchocolates',
  autoUpdates: true,
})
