import React from 'react'

import { Globe, Phone } from 'lucide-react'
import { Container } from '../ui/Container'
import { TopBarConfig } from '@/constants'

export async function TopBar(props: TopBarConfig) {
  return (
    <div className='bg-gray-900 text-muted'>
      <Container className="flex items-center justify-between py-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">{props.message}</span>
          <span className="sm:hidden">{props.shortMessage}</span>
        </div>
        <div className="flex items-center gap-4">
          {props.showLanguage ? (
            <button className="flex items-center gap-1">
              <Globe className="h-4 w-4" /> {props.languageLabel}
            </button>
          ) : null}
          {props.showContact ? (
            props.contactHref ? (
              <a href={props.contactHref} className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> {props.contactLabel}
              </a>
            ) : (
              <button className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> {props.contactLabel}
              </button>
            )
          ) : null}
        </div>
      </Container>
    </div>
  )
}
