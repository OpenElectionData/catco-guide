module Jekyll
  class RenderTextareaTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
       super
       @label = text.match(/(label=\")([\w|\s]*)(")/i).captures[1]
       @id = text.match(/(id=\")([\w|\s]*)(")/i).captures[1]
       @size = text.match(/(size=\")([\w|\s]*)(")/i).captures[1]

       @rows = 5
       case @size
       when 'small'
          @rows = 1
       when 'large'
          @rows = 10
       end

     end

    def render(context)
      body = super
      "<div class=\"form-default\">
        <label for=\"#{@id}\">#{@label}:</label>
        <textarea class=\"form-textarea form-textarea--#{@size}\" name=\"#{@id}\" id=\"#{@id}\" rows=\"#{@rows}\"></textarea>
      </div>"
    end

  end
end

Liquid::Template.register_tag('textarea', Jekyll::RenderTextareaTag)