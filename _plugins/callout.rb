module Jekyll
  class RenderCalloutBlock < Liquid::Block

    def initialize(tag_name, text, tokens)
       super
       @title = text.match(/(title=\")([\w|\s|(?!.,\-;:\')]*)(")/i).captures[1]
     end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)

      body = super
      "<aside class=\"callout\">
        <h3 class=\"callout__title\">#{@title}</h3>
        <div class=\"callout__body\">#{converter.convert(body)}</div>
      </aside>"
    end

  end
end

Liquid::Template.register_tag('callout', Jekyll::RenderCalloutBlock)