import React from 'react'

import { Globe, Phone } from 'lucide-react'
import { Container } from '../ui/Container'
import { TopBarConfig } from '@/constants'

export async function TopBar(props: TopBarConfig) {
  return (
    <div className="bg-gray-900 text-white text-xs tracking-tight">
      <Container className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">{props.message}</span>
          <span className="sm:hidden">{props.shortMessage}</span>
        </div>

        <div className="flex items-center gap-3">
          {props.showLanguage && (
            <button className="flex items-center gap-1 hover:opacity-80 transition">
              <Globe className="h-4 w-4" />
              <span>{props.languageLabel}</span>
            </button>
          )}

          {props.showContact && (
            <a
              href={props.contactHref ?? "#"}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition"
            >
              <Phone className="h-4 w-4" />
              <span>{props.contactLabel}</span>
            </a>
          )}
        </div>
      </Container>
    </div>
  );
}
