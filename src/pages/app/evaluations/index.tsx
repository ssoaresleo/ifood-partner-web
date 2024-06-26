import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Pencil1Icon, PersonIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { PaginationComponent } from "@/components/pagination";
import { getEvaluations } from "@/api/get-evaluations";
import { StarRate } from "../dashboard/_components/start-rate";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const evaluationFilterSchema = z.object({
  personName: z.string(),
  comment: z.string(),
});

type EvaluationFilterSchema = z.infer<typeof evaluationFilterSchema>;

function Evaluations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const personName = searchParams.get("name") || "";
  const comment = searchParams.get("comment") || "";

  const { register, handleSubmit } = useForm<EvaluationFilterSchema>({
    resolver: zodResolver(evaluationFilterSchema),
    values: {
      personName,
      comment,
    },
  });

  const handleEvaluationsFilters = (data: EvaluationFilterSchema) => {
    if (data.personName) {
      setSearchParams((prev) => {
        prev.set("name", data.personName);

        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete("name");

        return prev;
      });
    }

    if (data.comment) {
      setSearchParams((prev) => {
        prev.set("comment", data.comment);

        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete("comment");

        return prev;
      });
    }
  };

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  const { data } = useQuery({
    queryFn: () =>
      getEvaluations({ params: { pageIndex, personName, comment } }),
    queryKey: ["evaluations", "list", "page", pageIndex, personName, comment],
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set("page", (pageIndex + 1).toString());

      return prev;
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Comentários</h2>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <form
          className="flex items-center gap-4"
          onSubmit={handleSubmit(handleEvaluationsFilters)}
        >
          <div className="relative">
            <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 pr-4 py-2"
              placeholder="Buscar por pessoa"
              type="text"
              {...register("personName")}
            />
          </div>
          <div className="relative">
            <Pencil1Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 pr-4"
              placeholder="Filtrar por comentário"
              type="text"
              {...register("comment")}
            />
          </div>
          <Button type="submit">Filtrar comentário</Button>
        </form>
      </div>
      <div className="space-y-6">
        {data?.evaluations?.map((evaluation) => {
          const customerProfileNameFallback = evaluation.customerName
            .charAt(0)
            .toUpperCase();

          const createdAt = new Date(evaluation.createdAt!);

          const date = formatDistanceToNow(createdAt, {
            locale: ptBR,
            addSuffix: true,
          });

          return (
            <Card
              className="flex border-none items-start gap-4"
              key={evaluation.evaluationId}
            >
              <Avatar className="shrink-0">
                <AvatarFallback>{customerProfileNameFallback}</AvatarFallback>
              </Avatar>
              <CardContent className="flex-1 p-0">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <StarRate rating={evaluation.rate} className="left-0" />
                    <CardTitle className="font-medium mt-8">
                      {evaluation.customerName}
                    </CardTitle>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {date}
                  </span>
                </div>
                <CardDescription>{evaluation.comment}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {data?.evaluations && (
        <PaginationComponent
          pageIndex={pageIndex}
          totalCount={data.meta.totalCount}
          perPage={data.meta.perPage}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}

export default Evaluations;
