import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      className={styles.pagination}
      pageCount={totalPages}
      activeClassName={styles.active}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={page - 1}
      nextLabel="Next"
      previousLabel="Previous"
    />
  );
}
