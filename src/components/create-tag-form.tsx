import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";

/**
 * Para o POST desse desafio utilizei a Lib Zod com o react-hook-form, ela me garante ja a validação de formularios e me permite criar uma tipagem
 * a partir do objeto criado pelo Zod, utilizei o hook UseMutation do React query que tambem me permite atualizar a lista de objetos assim que uma
 * atualização foi feita (POST).
 */

const createTransactionSchema = z.object({
  description: z.string().min(3, { message: "Minimum 3 characters." }),
  value: z.string(),
});

interface CreateTransactionFormProps {
  open: boolean;
  onCloseDialog: () => void;
}

type CreateTransactionType = z.infer<typeof createTransactionSchema>;

export function CreateTagForm(props: CreateTransactionFormProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState } = useForm<CreateTransactionType>({
    resolver: zodResolver(createTransactionSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ description, value }: CreateTransactionType) => {
      const valueInInt = Number(value);
      valueInInt.toFixed(2);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await fetch("http://localhost:3333/transactions", {
        method: "POST",
        body: JSON.stringify({
          description: description,
          value: valueInInt,
          effectedAt: new Date(),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-transactions"],
      });
    },
  });

  async function handleTagCreation({
    description,
    value,
  }: CreateTransactionType) {
    await mutateAsync({ description, value });
    props.onCloseDialog();
  }

  return (
    <form
      onSubmit={handleSubmit(handleTagCreation)}
      className="w-full space-y-6"
    >
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium block">
          Transaction Description:
        </label>
        <input
          {...register("description")}
          type="text"
          id="title"
          className="border border-zinc-800 rounded-lg px-3 py-3 bg-zinc-800/50 w-full text-sm"
        />
        {formState.errors?.description && (
          <p className="text-sm text-red-500">
            {formState.errors.description.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium block">
          Value (USD):
        </label>
        <input
          {...register("value")}
          type="text"
          className="border border-zinc-800 rounded-lg px-3 py-3 bg-zinc-800/50 w-full text-sm"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="bg-teal-400 text-teal-950"
        >
          {formState.isSubmitting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
          Save
        </Button>
      </div>
    </form>
  );
}
