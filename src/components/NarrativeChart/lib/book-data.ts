import type { Datum } from './datum'
import type { SvgAnnotation } from './svg-annotation'

interface BookResponseDatum {
  title?: string
  first_author_name?: string
  language?: string
  date?: string
  x: string
  y: string
}

interface BookDatum extends Datum, Omit<BookResponseDatum, 'x' | 'y' | 'date'> {
  date: number
}

export const BOOK_DATA_URL =
  'https://raw.githubusercontent.com/ColinEberhardt/d3fc-webgl-hathi-explorer/master/data.tsv'

export function parseBookDatum(d: BookResponseDatum): BookDatum {
  return {
    ...d,
    x: Number(d.x),
    y: Number(d.y),
    date: Number(d.date),
  }
}

export function annotateBookDatum(d: BookDatum): SvgAnnotation {
  let title = d.title ?? ''
  if (title.length > 50) title = title.substr(0, 50) + '...'

  let label = `${d.first_author_name ?? 'Unknown'} \n${d.date}`
  if (d.language) label += ` \n(${d.language})`

  const note = { title, label, wrapSplitter: /\n/, bgPadding: 3 }
  return { note, x: d.x, y: d.y, dx: 20, dy: 20 }
}
