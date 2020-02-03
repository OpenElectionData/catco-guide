module Jekyll
  class RenderTextareaGroupBlock < Liquid::Block

    def initialize(tag_name, text, tokens)
       super
       @id = (text.match(/(id=\")([[:alnum:]|\s]*)(")/i) || [])[2]
     end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)

      body = super
      "<div class=\"textarea-group\" id=\"group__#{@id}\">
        #{converter.convert(body)}
        <button class=\"btn btn--pdf\" data-id=\"group__#{@id}\">Save as PDF</button>
      </div>"
    end

  end
end

Liquid::Template.register_tag('textarea_group', Jekyll::RenderTextareaGroupBlock)