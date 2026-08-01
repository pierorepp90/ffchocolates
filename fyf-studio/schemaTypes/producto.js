import {defineType, defineField} from 'sanity'

export const producto = defineType({
  name: 'producto',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().error('Poné el nombre del producto.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          {title: 'Bombones', value: 'Bombones'},
          {title: 'Cajas y estuches', value: 'Cajas y estuches'},
          {title: 'Paletas', value: 'Paletas'},
          {title: 'Tabletas', value: 'Tabletas'},
          {title: 'Souvenirs', value: 'Souvenirs'},
          {title: 'Otros', value: 'Otros'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'Bombones',
      validation: (Rule) => Rule.required().error('Elegí una categoría.'),
    }),
    defineField({
      name: 'images',
      title: 'Fotos',
      description: 'Subí una o varias fotos del producto. La primera es la principal.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              description: 'Breve descripción de la foto (accesibilidad/SEO). Opcional.',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('Subí al menos una foto.'),
    }),
    defineField({
      name: 'presentation',
      title: 'Presentación',
      description: 'Ej: "Caja x 12", "x 250 g", "Unidad".',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      description: 'Texto que aparece en el detalle del producto.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'price',
      title: 'Precio (ARS)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).error('Poné un precio en pesos.'),
    }),
    defineField({
      name: 'onSale',
      title: 'En oferta',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'salePrice',
      title: 'Precio de oferta (ARS)',
      description: 'Se muestra junto al precio anterior tachado. Solo si está en oferta.',
      type: 'number',
      hidden: ({document}) => !document?.onSale,
      validation: (Rule) =>
        Rule.custom((salePrice, context) => {
          if (!context.document?.onSale) return true
          if (salePrice == null) return 'Poné el precio de oferta.'
          if (salePrice < 0) return 'El precio de oferta no puede ser negativo.'
          return true
        }),
    }),
    defineField({
      name: 'availability',
      title: 'Disponibilidad',
      type: 'string',
      options: {
        list: [
          {title: 'Disponible', value: 'Disponible'},
          {title: 'Por encargo', value: 'Por encargo'},
          {title: 'Sin stock', value: 'Sin stock'},
        ],
        layout: 'radio',
      },
      initialValue: 'Disponible',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      description: 'Número para ordenar los productos en la lista (menor primero). Opcional.',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Orden manual',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'images.0',
      price: 'price',
      onSale: 'onSale',
      salePrice: 'salePrice',
      avail: 'availability',
    },
    prepare({title, subtitle, media, price, onSale, salePrice, avail}) {
      const shown = onSale && salePrice != null ? salePrice : price
      const money =
        shown != null ? '$ ' + new Intl.NumberFormat('es-AR').format(shown) : 'sin precio'
      const flag = avail && avail !== 'Disponible' ? ` · ${avail}` : ''
      return {
        title: title || 'Sin nombre',
        subtitle: `${subtitle || 'sin categoría'} — ${money}${flag}`,
        media,
      }
    },
  },
})
