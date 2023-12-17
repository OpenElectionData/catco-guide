# TODOs

- Add `menu_order` value to non-english guide items
- Set `uses_forms` to `false` on additional resources page
- GA updates
- Better system for photos with different classes ("center", "right", "left") & captions
- Copy English content to `/` (possibly set up Netlify redirect to handle this and go from `/` to `/en`)

# Redirects/Renames

- Rename #3 file to match permalink

# TinaCMS setup

- {% figure %}
- {% callout %}
- {% textarea %}

Shortcodes work, although not entirely because Tina formats them differently than 11ty requires.

https://discord.com/channels/835168149439643678/1186036738888564827

Possible solutions:

- Liquid doesn't require comma separated properties, switch?
- Can we hook into something in Tina that would let us modify how it's saved in the markdown file?
- Alternatively, can we modify it as a part of the eleventy process instead
