import { getConfig } from '@libs/config'
import type { HTMLAttributes } from 'astro/types'

export function getVersionedBsCssProps(direction: 'rtl' | undefined) {
  let bsCssLinkHref = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap'

  if (direction === 'rtl') {
    bsCssLinkHref = `${bsCssLinkHref}.rtl`
  }

  if (import.meta.env.PROD) {
    bsCssLinkHref = `${bsCssLinkHref}.min`
  }

  bsCssLinkHref = `${bsCssLinkHref}.css`

  const bsCssLinkProps: HTMLAttributes<'link'> = {
    href: bsCssLinkHref,
    rel: 'stylesheet'
  }

  if (import.meta.env.PROD) {
    bsCssLinkProps.integrity = direction === 'rtl' ? getConfig().cdn.css_rtl_hash : getConfig().cdn.css_hash
  }

  return bsCssLinkProps
}

export function getVersionedBsJsProps() {
  let bsJsScriptSrc = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle'

  if (import.meta.env.PROD) {
    bsJsScriptSrc = `${bsJsScriptSrc}.min`
  }

  bsJsScriptSrc = `${bsJsScriptSrc}.js`

  const bsJsLinkProps: HTMLAttributes<'script'> = {
    src: bsJsScriptSrc
  }

  if (import.meta.env.PROD) {
    bsJsLinkProps.integrity = getConfig().cdn.js_bundle_hash
  }

  return bsJsLinkProps
}
