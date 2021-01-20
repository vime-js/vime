# UI Design Patterns

## Functional Components

Functional components are naked (no styling) and only contain logic for accessbility and 
core functionality. This gives consumers complete freedom to style the component as they desire. 
For example, a `ToggleMuteControl` will only contain the logic for toggling the muted state of the 
player, and handling ARIA attributes on the button. 

Functional components are made possible thanks to the `<slot />` element and CSS classes. Following 
the `ToggleMuteControl` example, it may apply classes such as `vm-pressed` or `vm-focused` to 
the root element in the light DOM so you can purely style your component with HTML/CSS only.

## Binary State Component

WIP.

## Listening to events on the Player

WIP.

## Component Communication

Show cross component comms Controls → Captions/Settings (Collision detection).