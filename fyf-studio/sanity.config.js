import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes/index.js'

// El projectId no es secreto (es público): queda en el código sin problema.
// Se completa tras crear el proyecto con `npx sanity init`.
export default defineConfig({
  name: 'default',
  title: 'F&F Chocolates',

  projectId: '6xwkvttc',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
