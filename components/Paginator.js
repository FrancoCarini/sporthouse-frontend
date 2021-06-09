import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from 'react-bootstrap'

export default function Pagination({ page, prevNext }) {
  return (
    <>
    <div className="d-flex justify-content-center">
      <Link href={`/?page=${Number(page) - 1}`} passHref>
          <Button variant="info" disabled={typeof prevNext.prev !== 'undefined' ? false : true}>Prev</Button>
      </Link>
      <Link href={`/?page=${Number(page) + 1}`} passHref>
          <Button variant="info" disabled={typeof prevNext.next !== 'undefined' ? false : true}>Next</Button>
      </Link>
    </div>
    </>
  )
}
