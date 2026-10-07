import type { ComponentType } from 'react';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import styles from './Pagination.module.css';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

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
