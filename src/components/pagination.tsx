import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from "./ui/pagination";

export interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
  onPageChange: (pageIndex: number) => Promise<void> | void;
}

export const PaginationComponent = ({
  onPageChange,
  pageIndex,
  perPage,
  totalCount,
}: PaginationProps) => {
  const pages = Math.ceil(totalCount / perPage)

  return (
    <Pagination className="justify-end items-end">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={pageIndex === 0}
            onClick={() => onPageChange(0)}
          >
            <DoubleArrowLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="outline"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        </PaginationItem>
        <span className="text-sm px-2 text-muted-foreground">
          {pageIndex === 0 ? 1 : pageIndex + 1} de {pages}
        </span>
        <PaginationItem>
          <Button
            variant="outline"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pages <= pageIndex + 1}
          >
            <span className="sr-only">Próxima página</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={pages <= pageIndex + 1}
            onClick={() => onPageChange(pages - 1)}
          >
            <DoubleArrowRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
