import enStrings from '../src/_data/i18n/en.json';

export function acronymsFields() {
  return [
    {
      type: 'string',
      name: 'title',
      label: 'title'
    },
    {
      type: 'string',
      name: 'lang',
      label: 'lang'
    },
    {
      type: 'string',
      name: 'permalink',
      label: 'permalink'
    },
    {
      type: 'object',
      name: 'list',
      label: 'List',
      list: true,
      fields: [
        {
          type: 'string',
          name: 'acronym',
          label: 'Acronym'
        },
        {
          type: 'string',
          name: 'full_name',
          label: 'Full Name'
        }
      ]
    }
  ];
}

export function guide_fields() {
  return [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      isTitle: true,
      required: true
    },
    {
      type: 'string',
      name: 'subtitle',
      label: 'Subtitle'
    },
    {
      type: 'boolean',
      name: 'uses_forms',
      label: 'Uses Forms'
    },
    {
      type: 'number',
      name: 'menu_order',
      label: 'Order to appear in menu'
    },
    {
      type: 'object',
      name: 'image',
      label: 'Featured Image',
      fields: [
        {
          type: 'image',
          name: 'url',
          label: 'Featured Image'
        },
        {
          type: 'string',
          name: 'caption',
          label: 'Image Caption'
        }
      ]
    },
    {
      type: 'rich-text',
      name: 'body',
      label: 'Body of Document',
      description: 'This is the markdown body',
      isBody: true,
      parser: {
        type: 'mdx',
        skipEscaping: 'all'
      },
      templates: [
        {
          name: 'figure',
          label: 'Figure',
          match: {
            name: 'figure',
            start: '{%',
            end: '%}'
          },
          fields: [
            {
              name: 'children',
              type: 'rich-text'
            },
            {
              name: 'class',
              type: 'string'
            },
            {
              name: 'title',
              type: 'string',
              ui: {
                parse: (val) => console.log(val) || val
              }
            }
          ]
        }
      ]
    }
  ];
}

export function translation_fields() {
  const codes = Object.keys(enStrings).map((code) => {
    let component = code.includes('_desc') ? 'textarea' : 'text';

    if (code === '_template') {
      component = null;
    }

    return {
      type: 'string',
      name: code.replaceAll('-', '_'),
      nameOverride: code,
      label: code,
      searchable: false,
      ui: {
        component
      }
    };
  });

  return codes;
}
