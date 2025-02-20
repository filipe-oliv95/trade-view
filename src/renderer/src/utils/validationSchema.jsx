import { z } from 'zod';

export const ativosSchema = z.object({
    sigla: z
      .string()
      .min(2, { message: "A sigla deve ter pelo menos 2 caracteres." })
      .max(10, { message: "A sigla deve ter no máximo 10 caracteres." }),
    descricao: z
      .string()
      .min(2, { message: "A descrição deve ter pelo menos 2 caracteres." })
      .max(50, { message: "A descrição deve ter no máximo 50 caracteres." }),
    valor_contrato: z
      .number()
      .positive({ message: "O valor do contrato deve ser maior que zero." }),
  });

export const estrategiasSchema = z.object({
  nome: z
    .string()
    .max(50, { message: "O nome deve ter no máximo 50 caracteres." }),
  descricao: z
    .string()
    .max(50, { message: "A descrição deve ter no máximo 50 caracteres." })
    .optional(), // Descrição é opcional
  gain: z
    .number({ invalid_type_error: "O gain deve ser um número." })
    .positive({ message: "O gain deve ser maior que zero." }),
  loss: z
    .number({ invalid_type_error: "O loss deve ser um número." })
    .positive({ message: "O loss deve ser maior que zero." }),
  ativo_id: z
    .number({ invalid_type_error: "O ID do ativo deve ser um número." })
    .int({ message: "O ID do ativo deve ser um número inteiro." })
    .positive({ message: "O ID do ativo deve ser maior que zero." }),
});

export const dadosSchema = z.object({
    data: z
        .string()
        .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        { message: "A data deve estar no formato YYYY-MM-DD." }
        ),
    hora: z
        .string()
        .regex(
        /^\d{2}:\d{2}:\d{2}$/,
        { message: "A hora deve estar no formato HH:MM:SS." }
        ),
    ativo_id: z
        .number()
        .int({ message: "O ID do ativo deve ser um número inteiro." })
        .positive({ message: "O ID do ativo deve ser maior que zero." }),
    estrategia_id: z
        .number()
        .int({ message: "O ID da estratégia deve ser um número inteiro." })
        .positive({ message: "O ID da estratégia deve ser maior que zero." }),
    duracao: z
        .number()
        .positive({ message: "A duração deve ser maior que zero." }),
    lado: z
        .enum(["compra", "venda"], { message: "O lado deve ser 'compra' ou 'venda'." }),
    n_contratos: z
        .number()
        .int({ message: "O número de contratos deve ser um número inteiro." })
        .positive({ message: "O número de contratos deve ser maior que zero." }),
    men: z
        .number()
        .min(0, { message: "O MEN (Máximo Exposto Negativo) deve ser maior ou igual a zero." }),
    mep: z
        .number()
        .min(0, { message: "O MEP (Máximo Exposto Positivo) deve ser maior ou igual a zero." }),
    resultado_pnts: z
        .number()
        .finite({ message: "O resultado em pontos deve ser um número válido." }),
});