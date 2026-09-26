import type { AnalyzeResult, MediaFormat, MediaInfo } from "@/types/media";
import type { PlatformId } from "@/types/platform";

export interface PlatformAdapter {
  id: PlatformId;
  name: string;
  canHandle(url: string): boolean;
  validate(url: string): { valid: boolean; error?: string };
  analyze(url: string): Promise<AnalyzeResult>;
  getFormatSelector(formatId: string, formats: MediaFormat[]): string;
}
