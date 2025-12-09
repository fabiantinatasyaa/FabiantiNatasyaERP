import { GoogleGenAI, Type } from "@google/genai";
import { Customer, KPI, Appointment } from "../types";

// Initialize Gemini Client
// NOTE: In a production environment, never expose API keys on the client side.
// This is a prototype/demonstration using the key from process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = "gemini-2.5-flash";

/**
 * Generates an executive summary based on the current dashboard KPIs.
 */
export const generateExecutiveInsights = async (kpiData: KPI): Promise<string> => {
    try {
        const prompt = `
        You are an expert Salon Business Consultant. Analyze the following KPIs for "Lumina Salon" for this month:
        - Revenue: $${kpiData.revenue.toLocaleString()}
        - Total Appointments: ${kpiData.appointments}
        - Staff Utilization: ${kpiData.utilization}%
        - No-Show Rate: ${kpiData.noShowRate}%

        Provide a concise, 2-sentence strategic insight. Focus on what requires immediate attention or what is going well.
        Do not use markdown formatting.
        `;

        const response = await ai.models.generateContent({
            model: MODEL_FLASH,
            contents: prompt,
        });

        return response.text || "Unable to generate insights at this time.";
    } catch (error) {
        console.error("Gemini Insight Error:", error);
        return "AI Module Offline: Ensure API Key is configured.";
    }
};

/**
 * Predicts the next best service and product for a customer to increase LTV.
 */
export const recommendNextService = async (customer: Customer): Promise<{ service: string; reason: string }> => {
    try {
        const historyStr = customer.history.map(h => `${h.date}: Service ID ${h.serviceId}`).join("; ");
        
        const prompt = `
        Customer Profile:
        Name: ${customer.name}
        Preferences: ${customer.preferences.join(", ")}
        History: ${historyStr}

        Based on this data, recommend ONE next service that they are most likely to book.
        Return JSON format: { "service": "Service Name", "reason": "Short reason why" }
        `;

        const response = await ai.models.generateContent({
            model: MODEL_FLASH,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        service: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    }
                }
            }
        });

        const jsonStr = response.text;
        if (!jsonStr) throw new Error("Empty response");
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Gemini Recommendation Error:", error);
        return { service: "General Consultation", reason: "Standard check-in due." };
    }
};

/**
 * Analyzes schedule to find slots with high risk of cancellation/no-show.
 * Simulates "Predictive Scheduling".
 */
export const analyzeScheduleRisk = async (appointments: Appointment[]): Promise<string[]> => {
    try {
        // We act as if we are sending this to the AI.
        // In a real app, we would send the full object.
        // Here we just map a summary to save tokens.
        const summary = appointments.map(a => `ID:${a.id}, Time:${a.startTime}, Status:${a.status}`).join("\n");

        const prompt = `
        Analyze these appointments. Identify 2 appointments that might be at risk of 'No-Show' based on general salon trends (e.g. late Friday, early Monday).
        Return ONLY a JSON array of their IDs.
        
        Data:
        ${summary}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_FLASH,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
        const jsonStr = response.text;
        if(!jsonStr) return [];
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Gemini Risk Analysis Error:", error);
        return [];
    }
}