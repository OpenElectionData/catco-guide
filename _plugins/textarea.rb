module Jekyll
  class RenderTextareaTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
       super
       @label = text.match(/(label=\")([\w|\s]*)(")/i).captures[1]
       @id = text.match(/(id=\")([\w|\s]*)(")/i).captures[1]
     end

    def render(context)
      body = super
      "<div class=\"form-default\">
        <label for=\"#{@id}\">#{@label}:</label>
        <textarea class=\"form-textarea\" name=\"#{@id}\" id=\"#{@id}\"></textarea>
      </div>"
    end

  end
end

Liquid::Template.register_tag('textarea', Jekyll::RenderTextareaTag)