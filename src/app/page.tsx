"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CreateTagForm } from "../components/create-tag-form";
import { Filters } from "../components/filters";
import { Header } from "../components/header";
import { Pagination } from "../components/pagination";
import { Tabs } from "../components/tabs";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export interface TransactionsResponse {
  first: number;
  prev: number | null;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Transaction[];
}

export interface Transaction {
  id: string;
  description: string;
  value: number;
  effectedAt: string;
}

/**
 *
 * Nesse desafio optei por utilizar do React Query que trabalha muito bem com cache e evita requisições desnecessarias, também utilizei
 * da metodologia URLState para guardar informações de filtros e paginação da tabela, o que permite que se você mandar um link de um produto para
 * outra pessoa, assim que ela clicar estará ja filtrado do jeito que você filtrou, em vez de estar na "pagina inicial".
 */

/**
 *
 * Para estilização do desafio utilizei como requerido o TailwindCSS mas também utilizei variantes e mesclas do proprio tailwind CSS(são dependencias separadas)
 * isso me permite criar apenas um componente de Botão por exemplo e usar variantes dele pra que ele tenha diferentes estilos baseado nisso
 * mesmo que eu precise de uma classe especifica nesse botão eu consigo utilizar o mesmo componente poir o TWMerge me permite isso, ele mescla classe estatica no componente com classes adicionadas nas instancias desse componente
 */

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const filter = searchParams.get("filter") ?? "";
  const [useFilter, setUseFilter] = useState(filter);
  const [open, setOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  function handleFilter() {
    setSearchParams((params) => {
      params.set("page", "1");
      params.set("filter", useFilter);
      return params;
    });
  }

  const { data: transactionResponse, isLoading } =
    useQuery<TransactionsResponse>({
      queryKey: ["get-transactions", filter, page],
      queryFn: async () => {
        const response = await fetch(
          `http://localhost:3333/transactions?_page=${page}&_per_page=10&description=${filter}`
        );
        const data = await response.json();
        //Delay 1s
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return data;
      },
      placeholderData: keepPreviousData,
    });

  if (isLoading) {
    null;
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Transactions</h1>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button variant="primary">
                <Plus className="size-3" />
                Create New
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70" />
              <Dialog.Content className="fixed space-y-10 right-0 top-0 bottom-0 h-screen min-w-[320px] bg-zinc-950 border-l border-zinc-900 p-10">
                <div className="space-y-3">
                  <Dialog.Title className="text-xl font-bold">
                    Create Transactions
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-zinc-500">
                    Transactions could be credited or debited from the database.
                  </Dialog.Description>
                </div>
                <CreateTagForm open={open} onCloseDialog={handleCloseDialog} />
                <Dialog.Close />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        <div className="flex justify-between">
          <Filters
            useFilter={useFilter}
            setUseFilter={setUseFilter}
            handleFilter={handleFilter}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex justify-center">#</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>USD</TableHead>
              <TableHead className="flex justify-center">Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionResponse?.data.map((transaction) => {
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="flex items-center justify-center py-6">
                    <span className="text-zinc-300">{transaction.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {transaction.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`"text-zinc-300" ${
                      transaction.value < 0 ? "text-red-600" : "text-teal-400"
                    }`}
                  >
                    {transaction?.value?.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-zinc-300 flex justify-center">
                    {
                      new Date(transaction.effectedAt)
                        .toISOString()
                        .replace("T", " ")
                        .split(".")[0]
                    }
                  </TableCell>
                  <TableCell>
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {transactionResponse && (
          <Pagination
            page={page}
            pages={transactionResponse?.pages}
            items={transactionResponse?.items}
          />
        )}
      </main>
    </div>
  );
}
