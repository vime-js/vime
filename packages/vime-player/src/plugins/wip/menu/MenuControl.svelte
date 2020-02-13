<button
  id={$$props.id}
  role={$$props.role}
  class:audio={$isAudio}
  class:videoFocus={!$isTouch}
  class:audioFocus={$isAudio && !$isTouch}
  class:touchHighlight={showHighlight}
  use:focus
  use:highlight
  on:click
  on:highlightchange="{e => { showHighlight = e.detail }}"
  aria-label={title}
  aria-hidden={$$props['aria-hidden']}
  aria-checked={$$props['aria-checked']}
  aria-haspopup={$$props['aria-haspopup']}
  aria-controls={$$props['aria-controls']}
  aria-expanded={$$props['aria-expanded']}
  aria-disabled={$$props['aria-disabled']}
>
  <svg role="presentation" focusable="false">
    <use href={Icon.CHECKMARK}></use>
  </svg>
  <span class="arrow left"></span>
  <span>{title}</span>
  <span class="hint">{hint}</span>
  {#if badge}
    <span class="badge">{badge}</span>
  {/if}
  <span class="arrow right"></span>
</button>

<script>
  import { getContext } from 'svelte'
  import { focus, highlight } from '~actions'
  import { ctxKey } from '~src/context'
  import { isTouch } from '~src/store'
  import { Icon } from '~src/icons'

  const ctx = getContext(ctxKey)
  const isAudio = ctx.isAudio

  let showHighlight = false

  export let title
  export let hint = null
  export let badge = null
</script>

<style type="text/scss">
  @import '../../style/common';

  button {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100% !important;
    font-size: $menu-item-font-size !important;
    font-weight: $font-weight-regular !important;
    padding: 4px ($control-padding * 2);
    border: 0;
    margin: 0;
    cursor: pointer;
    color: #fff;
    background: inherit;

    &:focus {
      outline: 0;
    }

    &.audio {
      background: #fff;
      color: $color-gray-600;

      .hint, .badge {
        color: $color-gray-600;
      }
    }

    &.videoFocus {
      &:hover,
      &:focus {
        background: $color-white-100;
      }
    }

    &.audioFocus {
      &:hover,
      &:focus {
        background: $color-gray-100;
      }
    }

    &.touchHighlight {
      background: $color-white-100;

      &.audio {
        background: $color-gray-100;
      }
    }
  
    &[aria-hidden='true'] {
      display: none;
    }

    &[aria-disabled='true'] .arrow {
      display: none !important;
    }

    &[aria-expanded='true'] {
      .arrow.left {
        display: inline-block;
      }

      .hint {
        display: none;
      }
    }

    &[aria-expanded='false'] {
      .arrow.right {
        display: inline-block;
      }
    }

    &[aria-checked] {
      svg {
        display: inline-block;
      }

      .hint {
        display: none;
      }
    }

    &[aria-checked='true'] svg {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
  }

  svg {
    opacity: 0;
    display: none;
    fill: currentColor;
    pointer-events: none;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    transition: opacity 0.3s ease;
  }

  .hint {
    margin-left: auto;
    overflow: hidden;
    padding-left: ceil($control-padding * 3.5);
    pointer-events: none;
    font-size: 13px;
    opacity: 0.54;
    color: #fff;
  }

  .badge {
    color: #fff;
    font-size: 10px;
    line-height: 1;
    padding-left: 4px;
    overflow: hidden;
    pointer-events: none;
  }
  
  .arrow {
    border: 2px solid;
    color: inherit;
    border-width: 0 2px 2px 0;
    padding: 2px;
    display: none;

    &.left {
      margin-right: $control-padding;
      transform: rotate(135deg);
    }

    &.right {
      transform: rotate(-45deg);
      margin-left: $control-padding;
      opacity: 0.38;
    }
  }
</style>