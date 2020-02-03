module Jekyll
  class RenderTextareaTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
       super
       @label = (text.match(/(label=\")([[:alnum:]|\s|(?!.,\-;:\')]*)(")/i) || [])[2]
       @id = (text.match(/(id=\")([[:alnum:]|\s]*)(")/i) || [])[2]
       @size = (text.match(/(size=\")([[:alnum:]|\s]*)(")/i) || [])[2]
       @button = (text.match(/(button=\")([[:alnum:]|\s]*)(")/i) || [])[2]

       @rows = 5
       case @size
       when 'small'
          @rows = 1
       when 'large'
          @rows = 10
       end

       @btnHTML = "<button class=\"btn btn--pdf\" data-id=\"#{@id}\">Save as PDF</button>"
       if @button == 'false'
          @btnHTML = ''
       end

     end

    def render(context)
      body = super
      "<div class=\"form-default\">
        <label for=\"#{@id}\">#{@label}:</label>
        <textarea class=\"form-textarea form-textarea--#{@size}\" name=\"#{@id}\" id=\"#{@id}\" rows=\"#{@rows}\"></textarea>
        #{@btnHTML}
      </div>"
    end

  end
end

Liquid::Template.register_tag('textarea', Jekyll::RenderTextareaTag)