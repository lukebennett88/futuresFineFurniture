import customSlugify from './customSlugify';

export default {
  title: 'Range',
  name: 'range',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'slug',
      name: 'slug',
      type: 'slug',
      validation: Rule => Rule.required(),
      options: {
        readOnly: true,
        source: 'name',
        description: 'url safe name',
        slugify: customSlugify
      }
    },
    {
      title: 'Keywords',
      name: 'keywords',
      type: 'array',
      of: [{type: "string"}],
    },
    {
      title: 'Common',
      name: 'common',
      type: 'documentCommon',
    }
  ]
};