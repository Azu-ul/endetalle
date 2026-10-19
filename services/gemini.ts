import { GoogleGenAI } from "@google/genai";
import { ConstructionDetail } from '../types';

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing from environment variables.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const askArchitectAI = async (
  query: string,
  contextDetail: ConstructionDetail | null,
  history: { role: string; text: string }[] = []
): Promise<string> => {
  const client = getClient();
  if (!client) return "Error: API Key no configurada o cliente no inicializado.";

  const detailContext = contextDetail
    ? `
    CONTEXTO DEL DETALLE ACTUAL:
    Título: ${contextDetail.title}
    Categoría: ${contextDetail.category}
    Descripción: ${contextDetail.description}
    Especificaciones: ${contextDetail.specs.join(', ')}
    Materiales: ${contextDetail.materials.join(', ')}
    `
    : "No hay un detalle específico seleccionado actualmente.";

  const systemInstruction = `
    Eres un arquitecto senior y experto en construcción y cálculo de estructuras.
    Tu objetivo es ayudar a estudiantes y profesionales a entender detalles constructivos.
    
    Reglas:
    1. Sé técnico pero claro. Usa terminología precisa.
    2. Si el usuario pregunta sobre el detalle actual, usa la información de contexto proporcionada.
    3. Si la pregunta es general, responde basándote en tu conocimiento general de construcción (CTE en España o normas internacionales).
    4. Sé conciso. No escribas párrafos enormes. Usa listas si es necesario.
    
    ${detailContext}
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction,
      }
    });

    return response.text || "No pude generar una respuesta.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Lo siento, hubo un error al consultar con el asistente de IA.";
  }
};