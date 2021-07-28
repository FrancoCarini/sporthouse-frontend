import Link from 'next/link'
import { Button } from 'react-bootstrap'

export default function Pagination({ page, prevNext, onChangePage }) {
  return (
    <>
      <div className="d-flex justify-content-center">
        <Button onClick={() => {onChangePage(Number(page) - 1)}} variant="info" disabled={typeof prevNext.prev !== 'undefined' ? false : true}>Prev</Button>
        <Button onClick={() => {onChangePage(Number(page) + 1)}} variant="info" disabled={typeof prevNext.next !== 'undefined' ? false : true}>Next</Button>
      </div>
    </>
  )
}
