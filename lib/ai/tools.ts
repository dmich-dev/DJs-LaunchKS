import { tool } from 'ai';
import { z } from 'zod';

// Tavily API client (will be initialized in the API route)
interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  results: TavilySearchResult[];
}

/**
 * Search the web using Tavily API
 * Useful for finding current information about:
 * - Job markets and career paths
 * - Training programs and certifications
 * - Educational opportunities
 * - Kansas-specific resources
 */
export const searchWebTool = tool({
  description: 'Search the web for current information about careers, training programs, job markets, and educational opportunities. Particularly useful for Kansas-specific resources.',
  inputSchema: z.object({
    query: z.string().describe('The search query. Be specific and include relevant keywords like "Kansas", "free training", "certification", etc.'),
    max_results: z.number().min(1).max(10).default(5).optional().describe('Maximum number of results to return (1-10, default 5)'),
  }),
  execute: async ({ query, max_results = 5 }) => {
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!tavilyApiKey) {
      return 'Error: Tavily API key not configured. Please contact support.';
    }

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: tavilyApiKey,
          query: query,
          max_results: max_results,
          search_depth: 'basic',
          include_answer: true,
          include_raw_content: false,
        }),
      });

      if (!response.ok) {
        return `Error: Search failed with status ${response.status}`;
      }

      const data = await response.json() as TavilyResponse & { answer?: string };

      // Format the results for the AI
      let formattedResults = '';

      if (data.answer) {
        formattedResults += `**Quick Answer**: ${data.answer}\n\n`;
      }

      if (data.results && data.results.length > 0) {
        formattedResults += '**Search Results**:\n\n';
        data.results.forEach((result, index) => {
          formattedResults += `${index + 1}. **${result.title}**\n`;
          formattedResults += `   URL: ${result.url}\n`;
          formattedResults += `   ${result.content}\n\n`;
        });
      } else {
        formattedResults = 'No results found for this query.';
      }

      return formattedResults;
    } catch (error) {
      console.error('Tavily search error:', error);
      return `Error: Failed to search - ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
});

/**
 * Available AI tools for LaunchKS conversations
 */
export const availableTools = {
  search_web: searchWebTool,
};

export type AvailableTools = typeof availableTools;
