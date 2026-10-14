import { rateLimit } from "express-rate-limit";

// Limita tentativas em /auth/login e /auth/cadastro para dificultar
// ataques de força bruta (testar várias senhas seguidas).
export const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 50, // tentativas por IP nessa janela
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
});
